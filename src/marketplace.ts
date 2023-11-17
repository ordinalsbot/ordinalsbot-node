import { MarketPlaceClient } from "./marketplace_client";
import { InscriptionEnv } from "./types";
import {
  MarketplaceConfirmPaddingOutputsRequest,
  MarketplaceConfirmPaddingOutputsResponse,
  MarketplaceCreateListingRequest,
  MarketplaceCreateListingResponse,
  MarketplaceCreateOfferRequest,
  MarketplaceCreateOfferResponse,
  MarketplaceSetupPaddingOutputsRequest,
  MarketplaceSetupPaddingOutputsResponse,
  MarketplaceCreateRequest,
  MarketplaceCreateResponse,
  MarketplaceGetListingResponse,
  MarketplaceSubmitOfferRequest,
  MarketplaceSubmitOfferResponse,
  MarketplaceGetListingRequest,
  MarketplaceSaveListingRequest,
  MarketplaceSaveListingResponse,
  MarketplaceTransferRequest,
  MarketplaceTransferResponse,
} from "./types/marketplace_types";

import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { BitcoinNetworkType, getAddress, signTransaction } from 'sats-connect';

export class MarketPlace {
  private network: BitcoinNetworkType;
  private marketplaceInstance!: MarketPlaceClient;
  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.marketplaceInstance !== undefined) {
      console.error("marketplace constructore was called multiple times");
      return;
    }
    this.network = environment === 'live' ? BitcoinNetworkType.Mainnet : BitcoinNetworkType.Testnet;
    this.marketplaceInstance = new MarketPlaceClient(key, environment);
  }

  createMarketplace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.marketplaceInstance.createMarketPlace(createMarketplaceRequest);
  }

  async createListing(
    createListingRequest: MarketplaceCreateListingRequest
  ): Promise<MarketplaceCreateListingResponse | MarketplaceSaveListingResponse> {
    try {
      if (!createListingRequest.walletProvider) {
        return await this.marketplaceInstance.createListing(createListingRequest);
      } else {
        const { psbt } = await this.marketplaceInstance.createListing(createListingRequest);
        // Create the payload for signing the seller transaction
        if (!createListingRequest.sellerOrdinalAddress) {
          throw new Error('No seller address provided');
        }
        const sellerInput = {
          address: createListingRequest.sellerOrdinalAddress,
          signingIndexes: [0],
          sigHash:
            bitcoin.Transaction.SIGHASH_SINGLE |
            bitcoin.Transaction.SIGHASH_ANYONECANPAY,
        };
        
        const payload = {
          network: { type: this.network },
          message: 'Sign Seller Transaction',
          psbtBase64: psbt,
          broadcast: false,
          inputsToSign: [sellerInput],
          };
      
        return new Promise((resolve, reject) => {
          signTransaction({
            payload,
            onFinish: async (response) => {
              try {
                console.log('Transaction signed');
                console.log('Response:', response);
                const listingId = createListingRequest.sellerOrdinals[0].id;
                if (!listingId) {
                  throw new Error('No listing ID provided');
                }
                const updateListingData = {
                  signedListingPSBT: response.psbtBase64,
                };
                resolve(this.saveListing({ ordinalId: listingId, updateListingData }));
              } catch (error) {
                console.error('Error saving listing:', error);
                reject(error);
              }
            },
            onCancel: () => {
              console.log('Transaction canceled');
            }
          });
        });
      }
    } catch (error) {
      console.error('Error in createListing:', error);
      throw error;
    }
  }

  async createOffer(
    createOfferRequest: MarketplaceCreateOfferRequest
  ): Promise<MarketplaceCreateOfferResponse | string> {
    if (!createOfferRequest.walletProvider) {
      return this.marketplaceInstance.createOffer(createOfferRequest);
    }
    const offer: MarketplaceCreateOfferResponse = await this.marketplaceInstance.createOffer(createOfferRequest);
    const sellerInput = {
      address: createOfferRequest.buyerPaymentAddress,
      signingIndexes: offer.buyerInputIndices,
    };

    const payload = {
      network: {
        type: this.network,
      },
      message: 'Sign Buyer Transaction',
      psbtBase64: offer.psbt,
      broadcast: false,
      inputsToSign: [sellerInput],
    };
    return new Promise((resolve, reject) => {
      signTransaction({
        payload,
        onFinish: async (response) => {
          return resolve(response.psbtBase64)
        },
        onCancel: () => {
          console.log('Transaction canceled');
        }
      });
    });
  }

  submitOffer(
    submitOfferRequest: MarketplaceSubmitOfferRequest
  ): Promise<MarketplaceSubmitOfferResponse> {
    return this.marketplaceInstance.submitOffer(submitOfferRequest);
  }

  confirmPaddingOutputs(
    confirmPaddingOutputsRequest: MarketplaceConfirmPaddingOutputsRequest
  ): Promise<MarketplaceConfirmPaddingOutputsResponse> {
    return this.marketplaceInstance.confirmPaddingOutputs(
      confirmPaddingOutputsRequest
    );
  }

  async setupPaddingOutputs(
    setupPaddingOutputsRequest: MarketplaceSetupPaddingOutputsRequest
  ): Promise<MarketplaceSetupPaddingOutputsResponse> {
    if (!setupPaddingOutputsRequest.walletProvider) {
      return this.marketplaceInstance.setupPaddingOutputs(
        setupPaddingOutputsRequest
      );
    }
    const paddingOutputResponse: MarketplaceSetupPaddingOutputsResponse = await this.marketplaceInstance.setupPaddingOutputs(setupPaddingOutputsRequest);
    const buyerInputs = {
      address: setupPaddingOutputsRequest.address,
      signingIndexes: paddingOutputResponse.buyerInputIndices
    };

    const payload = {
      network: {
        type: this.network,
      },
      message: 'Sign Padding Outputs Transaction',
      psbtBase64: paddingOutputResponse.psbt,
      broadcast: true,
      inputsToSign: [buyerInputs],
    };
    
    return new Promise((resolve, reject) => {
      signTransaction({
        payload,
        onFinish: async (response) => response,
        onCancel: () => {
          console.log('Transaction canceled');
        }
      });
    });
  }

  getListing(
    getListingRequest: MarketplaceGetListingRequest
  ): Promise<MarketplaceGetListingResponse> {
    return this.marketplaceInstance.getListing(getListingRequest);
  }

  saveListing(
    saveListingRequest: MarketplaceSaveListingRequest
  ): Promise<MarketplaceSaveListingResponse> {
    return this.marketplaceInstance.saveListing(saveListingRequest);
  }

  async transfer(
    transferRequest: MarketplaceTransferRequest
  ): Promise<MarketplaceTransferResponse> {
    if (!transferRequest.walletProvider) {
      return this.marketplaceInstance.transfer(
        transferRequest
      );
    }
    const transferResponse: MarketplaceTransferResponse = await this.marketplaceInstance.transfer(transferRequest);
    const inputsToSign = [
      {
        address: transferRequest.senderOrdinalAddress,
        signingIndexes: transferResponse.senderOrdinalInputs,
        sigHash: bitcoin.Transaction.SIGHASH_ALL,
      },
      {
        address: transferRequest.senderPaymentAddress,
        signingIndexes: transferResponse.senderPaymentInputs,
        sigHash: bitcoin.Transaction.SIGHASH_ALL,
      },
    ];

    // Create the payload for signing the seller transaction
    const payload = {
      network: { type: this.network },
      message: 'Sign Transfer Transaction',
      psbtBase64: transferResponse.psbtBase64,
      broadcast: true,
      inputsToSign,
    };

    return new Promise((resolve, reject) => {
      signTransaction({
        payload,
        onFinish: async (response) => response,
        onCancel: () => {
          console.log('Transaction canceled');
        }
      });
    });
  }
}

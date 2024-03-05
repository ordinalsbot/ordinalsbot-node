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
  WALLET_PROVIDER,
  MarketplaceConfirmListingRequest,
  MarketplaceConfirmListingResponse,
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
  ): Promise<MarketplaceCreateListingResponse | MarketplaceConfirmListingResponse> {
    try {
      if (!createListingRequest.walletProvider) {
        return await this.marketplaceInstance.createListing(createListingRequest);
      } else if (createListingRequest.walletProvider === WALLET_PROVIDER.xverse) {
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
                // ordinal ids to confirm the listing
                const sellerOrdinalIds = createListingRequest.sellerOrdinals.map((item, index) => item.id)
                
                const confirmListingPayload: MarketplaceConfirmListingRequest = {
                  sellerOrdinals: sellerOrdinalIds as string[],
                  signedListingPSBT: response.psbtBase64,
                }
                
                resolve(this.confirmListing(confirmListingPayload));
              } catch (error) {
                console.error('Error confirm listing:', error);
                reject(error);
              }
            },
            onCancel: () => {
              console.log('Transaction canceled');
            }
          });
        });
      } else {
        throw new Error("Wallet not supported");
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
    } else if (createOfferRequest.walletProvider === WALLET_PROVIDER.xverse) {
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
    } else {
      throw new Error("Wallet not supported");
    }
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
      return this.marketplaceInstance.setupPaddingOutputs(setupPaddingOutputsRequest);
    } else if (setupPaddingOutputsRequest.walletProvider === WALLET_PROVIDER.xverse) {
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
    } else {
      throw new Error("Wallet not supported");
    }
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

  /**
   * Confirms a listing in the marketplace.
   * @param {MarketplaceConfirmListingRequest} confirmListingRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceConfirmListingResponse>} A promise that resolves with the response from confirming the listing.
   */
  confirmListing(
    confirmListingRequest: MarketplaceConfirmListingRequest
  ): Promise<MarketplaceConfirmListingResponse> {
    return this.marketplaceInstance.confirmListing(confirmListingRequest)
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

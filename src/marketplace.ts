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
} from "./types/marketplace_types";
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { BitcoinNetworkType, getAddress, signTransaction } from 'sats-connect';

export class MarketPlace {
  private marketplaceInstance!: MarketPlaceClient;
  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.marketplaceInstance !== undefined) {
      console.error("marketplace constructore was called multiple times");
      return;
    }
    this.marketplaceInstance = new MarketPlaceClient(key, environment);
  }

  createMarketplace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.marketplaceInstance.createMarketPlace(createMarketplaceRequest);
  }

  async createListing(
    createListingRequest: MarketplaceCreateListingRequest
  ): Promise<MarketplaceCreateListingResponse> {
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
          network: { type: BitcoinNetworkType.Testnet },
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
              reject(new Error('Transaction canceled'));
            }
          });
        });
      }
    } catch (error) {
      console.error('Error in createListing:', error);
      throw error;
    }
  }
  createOffer(
    createOfferRequest: MarketplaceCreateOfferRequest
  ): Promise<MarketplaceCreateOfferResponse> {
    return this.marketplaceInstance.createOffer(createOfferRequest);
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

  setupPaddingOutputs(
    setupPaddingOutputsRequest: MarketplaceSetupPaddingOutputsRequest
  ): Promise<MarketplaceSetupPaddingOutputsResponse> {
    return this.marketplaceInstance.setupPaddingOutputs(
      setupPaddingOutputsRequest
    );
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
}

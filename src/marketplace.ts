import { MarketPlaceClient } from "./marketplaceClient";
import { ClientOptions, InscriptionEnv, InscriptionEnvNetwork } from "./types";
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
  MarketplaceTransferAPIResponse,
  WALLET_PROVIDER,
  MarketplaceConfirmListingRequest,
  MarketplaceConfirmListingResponse,
  MarketplaceReListingRequest,
  MarketplaceReListingResponse,
  MarketplaceConfirmReListResponse,
  MarketplaceConfirmReListRequest,
  MarketplaceDeListRequest,
  MarketplaceDeListAPIResponse,
  MarketplaceConfirmDeListRequest,
  MarketplaceConfirmDeListResponse
} from "./types/marketplace_types";

import * as bitcoin from 'bitcoinjs-lib';
import { BitcoinNetworkType, SignTransactionResponse, signTransaction } from 'sats-connect';

export class MarketPlace {
  private network: BitcoinNetworkType;
  private marketplaceInstance!: MarketPlaceClient;

  /**
   * Creates an instance of MarketPlace.
   * @param {string} key - The API key for authentication.
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
  */
  constructor(key: string = "", environment: InscriptionEnv = InscriptionEnvNetwork.mainnet, options?: ClientOptions) {
    if (this.marketplaceInstance !== undefined) {
      console.error("marketplace constructore was called multiple times");
      return;
    }
    
    environment = InscriptionEnvNetwork[environment]??InscriptionEnvNetwork.mainnet;
    switch (environment) {
      case InscriptionEnvNetwork.mainnet:
        this.network = BitcoinNetworkType.Mainnet;
        break;
      case InscriptionEnvNetwork.testnet:
        this.network = BitcoinNetworkType.Testnet;
        break;
      case InscriptionEnvNetwork.signet:
        this.network = BitcoinNetworkType.Signet;
        break;
    
      default:
        this.network = BitcoinNetworkType.Mainnet
        break;
    }
    this.marketplaceInstance = new MarketPlaceClient(key, environment, options);
  }

  createMarketplace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.marketplaceInstance.createMarketPlace(createMarketplaceRequest);
  }

  /**
   * Create a new listing on the marketplace.
   * @param {MarketplaceCreateListingRequest} createListingRequest The request object containing information about the listing.
   * @returns {Promise<MarketplaceCreateListingResponse | MarketplaceConfirmListingResponse>} A promise that resolves to either a create listing response or a confirm listing response.
   */
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
        const inputIndices = createListingRequest.sellerOrdinals.map((item, index) => index);

        const sellerInput = {
          address: createListingRequest.sellerOrdinalAddress,
          signingIndexes: inputIndices,
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
  
  /**
   * Updated price for a exisiting listing on the marketplace.
   * @param {MarketplaceReListingRequest} reListingRequest The request object containing information about the listing.
   * @returns {Promise<MarketplaceReListingResponse | MarketplaceConfirmReListResponse>} A promise that resolves to either a create listing response or a confirm listing response.
   */
  async reListing(
    reListingRequest: MarketplaceReListingRequest
  ): Promise<MarketplaceReListingResponse | MarketplaceConfirmReListResponse> {
    try {
      if (!reListingRequest.walletProvider) {
        return await this.marketplaceInstance.reListing(reListingRequest);
      } else if (reListingRequest.walletProvider === WALLET_PROVIDER.xverse) {
        const { psbt } = await this.marketplaceInstance.reListing(reListingRequest);
        // Create the payload for signing the seller transaction
        if (!reListingRequest.sellerOrdinalAddress) {
          throw new Error('No seller address provided');
        }
        const sellerInput = {
          address: reListingRequest.sellerOrdinalAddress,
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
                const confirmReListingPayload = {
                  ordinalId: reListingRequest.ordinalId,
                  signedListingPSBT: response.psbtBase64,
                }
                resolve(this.confirmReListing(confirmReListingPayload));
              } catch (error) {
                console.error('Error confirm relisting:', error);
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
      console.error('Error in reListing:', error);
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

  /**
   * Confirms relisting in the marketplace.
   * @param {MarketplaceConfirmReListRequest} confirmReListingRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceConfirmReListResponse>} A promise that resolves with the response from confirming the listing.
   */
  confirmReListing(
    confirmReListingRequest: MarketplaceConfirmReListRequest
  ): Promise<MarketplaceConfirmReListResponse> {
    return this.marketplaceInstance.confirmReListing(confirmReListingRequest)
  }

  async transfer(
    transferRequest: MarketplaceTransferRequest
  ): Promise<SignTransactionResponse | MarketplaceTransferAPIResponse> {
    if (!transferRequest.walletProvider) {
      return this.marketplaceInstance.transfer(
        transferRequest
      );
    }
    const transferResponse: MarketplaceTransferAPIResponse = await this.marketplaceInstance.transfer(transferRequest);
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
        onFinish: async (response: any) => {
          return resolve(response)
        },
        onCancel: () => {
          console.log('Transaction canceled');
        }
      });
    });
  }

  /**
   * DeLists the listed ordinal from marketplace
   * @param {MarketplaceDeListRequest} deListingRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceDeListAPIResponse>} A promise that resolves with the response from confirming the listing.
   */
  async deList(
    deListingRequest: MarketplaceDeListRequest
  ): Promise<MarketplaceDeListAPIResponse | MarketplaceConfirmDeListResponse> {
    if (!deListingRequest.walletProvider) {
      return this.marketplaceInstance.deList(
        deListingRequest
      );
    }
    const transferResponse: MarketplaceDeListAPIResponse = await this.marketplaceInstance.deList(deListingRequest);
    const inputsToSign = [
      {
        address: deListingRequest.senderOrdinalAddress,
        signingIndexes: transferResponse.senderOrdinalInputs,
        sigHash: bitcoin.Transaction.SIGHASH_ALL,
      },
      {
        address: deListingRequest.senderPaymentAddress,
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
        onFinish: async (response) => {
          try {
            const confirmDeListingPayload = {
              ordinalId: deListingRequest.ordinalId,
              sellerPaymentAddress: deListingRequest.senderPaymentAddress,
            };
            const confirmDeListResponse = await this.confirmDeListing(
              confirmDeListingPayload
            );
            resolve({
              ...confirmDeListResponse,
              txId: response?.txId,
            });
          } catch (error) {
            console.error("Error delisting ordinal:", error);
            reject(error);
          }
        },
        onCancel: () => {
          console.log("Transaction canceled");
        },
      });
    });
  }

  /**
   * Confirms delisting in the marketplace.
   * @param {MarketplaceConfirmDeListRequest} confirmDeListingRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceConfirmDeListResponse>} A promise that resolves with the response from confirming the listing.
   */
  confirmDeListing(
    confirmDeListingRequest: MarketplaceConfirmDeListRequest
  ): Promise<MarketplaceConfirmDeListResponse> {
    return this.marketplaceInstance.confirmDeListing(confirmDeListingRequest)
  }
}

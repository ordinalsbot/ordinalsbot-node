import { InscriptionClient } from "../client";
import { ClientOptions, InscriptionEnv, InscriptionEnvNetwork, v1 } from "../types";
import { RunesEtchOrderRequest, RunesEtchOrderResponse, RunesMintOrderRequest, RunesMintOrderResponse } from "../types/runes_types";
import { CreateParentChildPsbtRequest, CreateParentChildPsbtResponse } from '../types/v1';
import { BitcoinNetworkType, SignTransactionResponse, signTransaction } from 'sats-connect';

/**
 * Main class for interacting with the Inscription API.
 */
export class Inscription {
  /** The instance of InscriptionClient. */
  instance!: InscriptionClient;

  private network: BitcoinNetworkType;

  /**
   * Creates an instance of Inscription.
   * @param {string} [key=''] The API key.
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
  */
  constructor(key: string = "", environment: InscriptionEnv = InscriptionEnvNetwork.mainnet, options?: ClientOptions) {
    if (this.instance !== undefined) {
      console.error("inscription.setCredentials was called multiple times");
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
    this.instance = new InscriptionClient(key, environment, options);
  }

  /**
   * Gets the price for a given price request.
   * @param {v1.InscriptionPriceRequest} priceRequest The price request.
   * @returns {Promise<v1.InscriptionPriceResponse>} A promise that resolves with the price response.
   */
  getPrice(
    priceRequest: v1.InscriptionPriceRequest
  ): Promise<v1.InscriptionPriceResponse> {
    return this.instance.getPrice(priceRequest);
  }

  /**
   * Creates an order with the given order request.
   * @param {v1.InscriptionOrderRequest} order The order request.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the created order.
   */
  createOrder(order: v1.InscriptionOrderRequest): Promise<v1.InscriptionOrder> {
    return this.instance.createOrder(order);
  }

  /**
   * Gets an order by its ID.
   * @param {string} id The ID of the order to retrieve.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the retrieved order.
   */
  getOrder(id: string): Promise<v1.InscriptionOrder> {
    return this.instance.getOrder(id);
  }

  /**
   * Creates an order with the given order request.
   * @param {v1.DirectInscriptionOrderRequest} order The order request.
   * @returns {Promise<v1.DirectInscriptionOrder>} A promise that resolves with the created order.
   */
  createDirectOrder(order: v1.DirectInscriptionOrderRequest): Promise<v1.DirectInscriptionOrder> {
    return this.instance.createDirectOrder(order);
  }

  /**
   * Creates a collection with the given collection create request.
   * @param {v1.InscriptionCollectionCreateRequest} collection The collection create request.
   * @returns {Promise<v1.InscriptionCollectionCreateResponse>} A promise that resolves with the created collection response.
   */
  createCollection(
    collection: v1.InscriptionCollectionCreateRequest
  ): Promise<v1.InscriptionCollectionCreateResponse> {
    return this.instance.createCollection(collection);
  }

  /**
   * updates collection phases with the given collection id.
   * @param {v1.UpdateCollectionPhasesRequest} collection The request data.
   * @returns {Promise<v1.InscriptionCollectionCreateResponse>} A promise that resolves with the updated collection response.
   */
  updateCollectionPhases(
    collection: v1.UpdateCollectionPhasesRequest
  ): Promise<v1.InscriptionCollectionCreateResponse> {
    return this.instance.updateCollectionPhases(collection);
  }

  /**
   * Fetch the allocation and inscribedCount of reciever address by phases from collection.
   * @param {v1.GetAllocationRequest} allocation The request data.
   * @returns {Promise<v1.GetAllocationResponse>} A promise that resolves with the allocation response.
   */
  getAllocation(
    allocation: v1.GetAllocationRequest
  ): Promise<v1.GetAllocationResponse> {
    return this.instance.getAllocation(allocation);
  }

  /**
   * Creates a collection order with the given collection order request.
   * @param {v1.InscriptionCollectionOrderRequest} collectionOrder The collection order request.
   * @returns {Promise<v1.InscriptionCollectionOrderResponse>} A promise that resolves with the created collection order.
   */
  createCollectionOrder(
    collectionOrder: v1.InscriptionCollectionOrderRequest
  ): Promise<v1.InscriptionCollectionOrderResponse> {
    return this.instance.createCollectionOrder(collectionOrder);
  }

  /**
   * Creates a text order with the given text order request.
   * @param {v1.InscriptionTextOrderRequest} order The text order request.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the created text order.
   */
  createTextOrder(
    order: v1.InscriptionTextOrderRequest
  ): Promise<v1.InscriptionOrder> {
    return this.instance.createTextOrder(order);
  }

  /**
   * Creates an runes etch order with the given order request.
   * @param {RunesEtchOrderRequest} order The order request.
   * @returns {Promise<RunesEtchOrderResponse>} A promise that resolves with the created order.
   */
  createRunesEtchOrder(
    order: RunesEtchOrderRequest
  ): Promise<RunesEtchOrderResponse> {
    return this.instance.createRunesEtchOrder(order);
  }

  /**
   * Creates an runes mint order with the given order request.
   * @param {RunesMintOrderRequest} order The order request.
   * @returns {Promise<RunesMintOrderResponse>} A promise that resolves with the created order.
   */
  createRunesMintOrder(
    order: RunesMintOrderRequest
  ): Promise<RunesMintOrderResponse> {
    return this.instance.createRunesMintOrder(order);
  }

  /**
   * Gets the inventory of available items.
   * @returns {Promise<v1.InscriptionInventoryResponse[]>} A promise that resolves with the inventory response.
   */
  getInventory(): Promise<v1.InscriptionInventoryResponse[]> {
    return this.instance.getInventory();
  }

  /**
   * Sets a referral code.
   * @param {v1.InscriptionReferralRequest} referral The referral request.
   * @returns {Promise<v1.InscriptionReferralSetResponse>} A promise that resolves with the referral set response.
   */
  setReferralCode(
    referral: v1.InscriptionReferralRequest
  ): Promise<v1.InscriptionReferralSetResponse> {
    return this.instance.setReferralCode(referral);
  }

  /**
   * Gets the status of a referral.
   * @param {v1.InscriptionReferralRequest} referral The referral request.
   * @returns {Promise<v1.InscriptionReferralStatusResponse>} A promise that resolves with the referral status response.
   */
  getReferralStatus(
    referral: v1.InscriptionReferralRequest
  ): Promise<v1.InscriptionReferralStatusResponse> {
    return this.instance.getReferralStatus(referral);
  }

  /**
   * Creates a special sats psbt.
   * @param {v1.CreateSpecialSatsRequest} createSpecialSatsRequest The order request.
   * @returns {Promise<v1.CreateSpecialSatsResponse>} A promise that resolves with the psbt for special sats.
   */
  createSpecialSatsPSBT(
    createSpecialSatsRequest: v1.CreateSpecialSatsRequest
  ): Promise<v1.CreateSpecialSatsResponse> {
    return this.instance.createSpecialSatsPSBT(createSpecialSatsRequest);
  }

  /**
   * Creates a Parent-Child PSBT (Partially Signed Bitcoin Transaction).
   *
   * @param {CreateParentChildPsbtRequest} createParentChildPsbt - The request object for creating the Parent-Child PSBT.
   * @returns {Promise<SignTransactionResponse | CreateParentChildPsbtResponse>} A promise that resolves to either a SignTransactionResponse or CreateParentChildPsbtResponse.
   */
  async createParentChildPsbt(
    createParentChildPsbt: CreateParentChildPsbtRequest
  ): Promise<SignTransactionResponse | CreateParentChildPsbtResponse> {
    if (!createParentChildPsbt.walletProvider) {
      return this.instance.createParentChildPsbt(createParentChildPsbt);
    }
    const result: CreateParentChildPsbtResponse = await this.instance.createParentChildPsbt(createParentChildPsbt);
    const inputsToSign = [
      {
        address: createParentChildPsbt.userOrdinalsAddress,
        signingIndexes: result.ordinalInputIndices
      },
      {
        address: createParentChildPsbt.userAddress,
        signingIndexes: result.paymentInputIndices
      },
    ];

    // Create the payload for signing the seller transaction
    const payload = {
      network: { type: this.network },
      message: 'Sign Payment Transaction',
      psbtBase64: result.psbtBase64,
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
          console.log('Payment canceled');
        }
      });
    });
  }
}

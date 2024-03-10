import { InscriptionClient } from '../client'
import { InscriptionEnv, v1 } from '../types'

/**
 * Main class for interacting with the Inscription API.
 */
export class Inscription {
  /** The instance of InscriptionClient. */
  instance!: InscriptionClient

  /**
   * Creates an instance of Inscription.
   * @param {string} [key=''] The API key.
   * @param {InscriptionEnv} [environment='live'] The environment (live or dev).
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    if (this.instance !== undefined) {
      console.error('inscription.setCredentials was called multiple times')
      return
    }
    this.instance = new InscriptionClient(key, environment)
  }

  /**
   * Gets the price for a given price request.
   * @param {v1.InscriptionPriceRequest} priceRequest The price request.
   * @returns {Promise<v1.InscriptionPriceResponse>} A promise that resolves with the price response.
   */
  getPrice(
    priceRequest: v1.InscriptionPriceRequest
  ): Promise<v1.InscriptionPriceResponse> {
    return this.instance.getPrice(priceRequest)
  }

  /**
   * Creates an order with the given order request.
   * @param {v1.InscriptionOrderRequest} order The order request.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the created order.
   */
  createOrder(order: v1.InscriptionOrderRequest): Promise<v1.InscriptionOrder> {
    return this.instance.createOrder(order)
  }

  /**
   * Gets an order by its ID.
   * @param {string} id The ID of the order to retrieve.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the retrieved order.
   */
  getOrder(id: string): Promise<v1.InscriptionOrder> {
    return this.instance.getOrder(id)
  }

  /**
   * Creates a collection with the given collection create request.
   * @param {v1.InscriptionCollectionCreateRequest} collection The collection create request.
   * @returns {Promise<v1.InscriptionCollectionCreateResponse>} A promise that resolves with the created collection response.
   */
  createCollection(
    collection: v1.InscriptionCollectionCreateRequest
  ): Promise<v1.InscriptionCollectionCreateResponse> {
    return this.instance.createCollection(collection)
  }

  /**
   * Creates a collection order with the given collection order request.
   * @param {v1.InscriptionCollectionOrderRequest} collectionOrder The collection order request.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the created collection order.
   */
  createCollectionOrder(
    collectionOrder: v1.InscriptionCollectionOrderRequest
  ): Promise<v1.InscriptionOrder> {
    return this.instance.createCollectionOrder(collectionOrder)
  }

  /**
   * Creates a text order with the given text order request.
   * @param {v1.InscriptionTextOrderRequest} order The text order request.
   * @returns {Promise<v1.InscriptionOrder>} A promise that resolves with the created text order.
   */
  createTextOrder(
    order: v1.InscriptionTextOrderRequest
  ): Promise<v1.InscriptionOrder> {
    return this.instance.createTextOrder(order)
  }

  /**
   * Gets the inventory of available items.
   * @returns {Promise<v1.InscriptionInventoryResponse[]>} A promise that resolves with the inventory response.
   */
  getInventory(): Promise<v1.InscriptionInventoryResponse[]> {
    return this.instance.getInventory()
  }

  /**
   * Sets a referral code.
   * @param {v1.InscriptionReferralRequest} referral The referral request.
   * @returns {Promise<v1.InscriptionReferralSetResponse>} A promise that resolves with the referral set response.
   */
  setReferralCode(
    referral: v1.InscriptionReferralRequest
  ): Promise<v1.InscriptionReferralSetResponse> {
    return this.instance.setReferralCode(referral)
  }

  /**
   * Gets the status of a referral.
   * @param {v1.InscriptionReferralRequest} referral The referral request.
   * @returns {Promise<v1.InscriptionReferralStatusResponse>} A promise that resolves with the referral status response.
   */
  getReferralStatus(
    referral: v1.InscriptionReferralRequest
  ): Promise<v1.InscriptionReferralStatusResponse> {
    return this.instance.getReferralStatus(referral)
  }
}

import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "./inscription/error";
import { InscriptionEnv } from "./types";
import {
  InscriptionPriceRequest,
  InscriptionPriceResponse,
  InscriptionOrderRequest,
  InscriptionOrder,
  InscriptionCollectionCreateRequest,
  InscriptionCollectionCreateResponse,
  InscriptionCollectionOrderRequest,
  InscriptionTextOrderRequest,
  InscriptionInventoryResponse,
  InscriptionReferralRequest,
  InscriptionReferralSetResponse,
  InscriptionReferralStatusResponse,
  CreateSpecialSatsRequest,
  CreateSpecialSatsResponse,
  InscriptionCollectionOrderResponse,
} from "./types/v1";

const qs = require("qs");
const version = require("../package.json")?.version || "local";
const packageVersion = `npm-inscription-v${version}`;

/**
 * Represents a client for interacting with the Inscription API.
 */
export class InscriptionClient {
  /**
   * The environment for the API client.
   */
  public env: InscriptionEnv;

  private api_key: string;
  private instanceV1: AxiosInstance;

  /**
   * Constructs an instance of InscriptionClient.
   * @param {string} key - The API key for authentication.
   * @param {InscriptionEnv} environment - The environment for the client, either 'live' or 'dev'.
   */
  constructor(key: string = "", environment: InscriptionEnv = "live") {
    this.api_key = key;
    this.env = environment;

    const createInstance = (): AxiosInstance => {
      const client = axios.create({
        baseURL:
          environment === "live"
            ? `https://api.ordinalsbot.com`
            : `https://testnet-api.ordinalsbot.com`,
        timeout: 30000,
        headers: {
          "x-api-key": this.api_key,
          Connection: "Keep-Alive",
          "Content-Type": "application/json",
          "Keep-Alive": "timeout=10",
          "User-Agent": packageVersion,
        },
      });

      client.interceptors.response.use(
        // normalize responses
        ({ data }) => ("data" in data ? data.data : data),
        (err) => {
          if (axios.isAxiosError(err)) {
            // added to keep compatibility with previous versions
            throw new InscriptionError(
              err.message,
              err.response?.statusText,
              err.response?.status
            );
          }

          if (err instanceof Error) throw err;

          return err;
        }
      );

      return client;
    };

    this.instanceV1 = createInstance();
  }

  /**
   * Exposes the Axios instance for direct usage.
   * @returns {AxiosInstance} The Axios instance.
   */
  get axiosInstance(): AxiosInstance {
    return this.instanceV1;
  }

  /**
   * Retrieves the price for a given request.
   * @param {InscriptionPriceRequest} priceRequest - The request object for price calculation.
   * @returns {Promise<InscriptionPriceResponse>} A promise resolving with the price response.
   */
  async getPrice(
    priceRequest: InscriptionPriceRequest
  ): Promise<InscriptionPriceResponse> {
    return this.instanceV1.get(`/price`, {
      params: priceRequest,
    });
  }

  /**
   * Creates an inscription order.
   * @param {InscriptionOrderRequest} order - The request object for creating the order.
   * @returns {Promise<InscriptionOrder>} A promise resolving with the created order.
   */
  async createOrder(order: InscriptionOrderRequest): Promise<InscriptionOrder> {
    return this.instanceV1.post(`/order`, order);
  }

  /**
   * Retrieves an inscription order by ID.
   * @param {string} id - The ID of the order to retrieve.
   * @returns {Promise<InscriptionOrder>} A promise resolving with the retrieved order.
   */
  async getOrder(id: string): Promise<InscriptionOrder> {
    return this.instanceV1.get(`/order`, {
      params: { id },
    });
  }

  /**
   * Creates a collection for inscriptions.
   * @param {InscriptionCollectionCreateRequest} collection - The request object for creating the collection.
   * @returns {Promise<InscriptionCollectionCreateResponse>} A promise resolving with the created collection response.
   */
  async createCollection(
    collection: InscriptionCollectionCreateRequest
  ): Promise<InscriptionCollectionCreateResponse> {
    // modify normal json to valid form data for files
    const plainObject = Object.assign({ ...collection });
    const files = collection?.files;
    for (const index in files) {
      const file: any = files[index];
      const keys = Object.keys(file);
      for (const key in keys) {
        const propName = keys[key];
        plainObject[`files[${index}][${propName}]`] = file[propName];
      }
    }
    delete plainObject.files;
    const data = qs.stringify(plainObject);
    // modify normal json to valid form data for files

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: this.instanceV1.getUri() + "/collectioncreate",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    return axios.request(config);
  }

  /**
   * Creates an order for a collection.
   * @param {InscriptionCollectionOrderRequest} collectionOrder - The request object for creating the collection order.
   * @returns {Promise<InscriptionCollectionOrderResponse>} A promise resolving with the created collection order response.
   */
  async createCollectionOrder(
    collectionOrder: InscriptionCollectionOrderRequest
  ): Promise<InscriptionCollectionOrderResponse> {
    return this.instanceV1.post(`/collectionorder`, collectionOrder);
  }

  /**
   * Creates an order for text inscription.
   * @param {InscriptionTextOrderRequest} order - The request object for creating the text order.
   * @returns {Promise<InscriptionOrder>} A promise resolving with the created text order.
   */
  async createTextOrder(
    order: InscriptionTextOrderRequest
  ): Promise<InscriptionOrder> {
    return this.instanceV1.post(`/textorder`, order);
  }

  /**
   * Retrieves inventory information.
   * @returns {Promise<InscriptionInventoryResponse[]>} A promise resolving with the inventory information.
   */
  async getInventory(): Promise<InscriptionInventoryResponse[]> {
    return this.instanceV1.get(`/inventory`);
  }

  /**
   * Sets a referral code.
   * @param {InscriptionReferralRequest} referral - The request object for setting the referral code.
   * @returns {Promise<InscriptionReferralSetResponse>} A promise resolving with the response of setting the referral code.
   */
  async setReferralCode(
    referral: InscriptionReferralRequest
  ): Promise<InscriptionReferralSetResponse> {
    return this.instanceV1.post(`/referrals`, referral);
  }

  /**
   * gets a referral code.
   * @param {InscriptionReferralRequest} referral - The request object for setting the referral code.
   * @returns {Promise<InscriptionReferralStatusResponse>} A promise resolving with the response of setting the referral code.
   */
  async getReferralStatus(
    referral: InscriptionReferralRequest
  ): Promise<InscriptionReferralStatusResponse> {
    return this.instanceV1.get(`/referrals`, {
      params: referral,
    });
  }

  /**
   * Creates a special Sats PSBT.
   * @param {CreateSpecialSatsRequest} createSpecialSatsRequest - The request object containing the details for creating the PSBT.
   * @returns {Promise<CreateSpecialSatsResponse>} A promise that resolves with the response containing the created PSBT.
   */
  async createSpecialSatsPSBT(
    createSpecialSatsRequest: CreateSpecialSatsRequest
  ): Promise<CreateSpecialSatsResponse> {
    return this.instanceV1.post(`/create-special-sats-psbt`, {
      ...createSpecialSatsRequest,
    });
  }
}

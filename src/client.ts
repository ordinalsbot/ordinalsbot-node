import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "./inscription/error";
import { ClientOptions, EnvNetworkExplorer, InscriptionEnv, InscriptionEnvNetwork } from "./types";
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
  UpdateCollectionPhasesRequest,
  GetAllocationRequest,
  GetAllocationResponse,
  DirectInscriptionOrderRequest,
  DirectInscriptionOrder,
  CreateParentChildPsbtRequest,
  CreateParentChildPsbtResponse,
} from "./types/v1";
import { sha256 } from 'bitcoinjs-lib/src/crypto';
import { RunesEtchOrderRequest, RunesEtchOrderResponse, RunesMintOrderRequest, RunesMintOrderResponse } from "./types/runes_types";
import { setupL402Interceptor } from "l402";

const qs = require("qs");

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
  private apikeyhash: string;

  /**
   * Constructs an instance of InscriptionClient.
   * @param {string} [key=''] - The API key for authentication.
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
   */
  constructor(key: string = "", environment: InscriptionEnv = InscriptionEnvNetwork.mainnet, options?: ClientOptions) {
    this.api_key = key;
    this.env = InscriptionEnvNetwork[environment]??InscriptionEnvNetwork.mainnet;

    /**
     * Creates a new Axios instance with appropriate headers.
     * @returns {AxiosInstance} The new Axios instance.
     */
    const createInstance = (): AxiosInstance => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };

      // Add the API key header only if this.api_key has a value
      if (this.api_key) {
        headers["x-api-key"] = this.api_key;
      }

      // Choose the base URL based on whether L402 is used or not
      const baseURL = options?.useL402
        ? "https://ordinalsbot.ln.sulu.sh"
        : EnvNetworkExplorer[this.env] || EnvNetworkExplorer.mainnet

      // Create the Axios client with the appropriate base URL
      const client = axios.create({
        baseURL,
        headers: headers,
      });

      client.interceptors.response.use(
        ({ data }) => ("data" in data ? data.data : data),
        (err) => {
          if (axios.isAxiosError(err) && err.response?.status !== 402) { // avoid modifying L402 errors.
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

      // If L402 is enabled and configuration is provided, set up the L402 interceptor
      if (options?.useL402 && options.l402Config) {
        setupL402Interceptor(client as any, options.l402Config.wallet, options.l402Config.tokenStore);
      };

      return client;
    };

    // Create the Axios instance
    this.instanceV1 = createInstance();

    this.apikeyhash = sha256(Buffer.from(this.api_key)).toString("hex");
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
   * Creates a direct (non-custodial) inscription order.
   * @param {DirectInscriptionOrderRequest} order - The request object for creating the order.
   * @returns {Promise<DirectInscriptionOrder>} A promise resolving with the created order.
   */
  async createDirectOrder(order: DirectInscriptionOrderRequest): Promise<DirectInscriptionOrder> {
    return this.instanceV1.post(`/inscribe`, order);
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
    let plainObject = Object.assign({ ...collection });
    let files = collection?.files;
    for (let index in files) {
      let file: any = files[index];
      let keys = Object.keys(file);
      for (let key in keys) {
        let propName = keys[key];
        plainObject[`files[${index}][${propName}]`] = file[propName];
      }
    }
    delete plainObject.files;
    plainObject.apikeyhash = this.apikeyhash;
    const data = qs.stringify(plainObject);
    // modify normal json to valid form data for files

    let config = {
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
   * updates collection phases.
   * @param {UpdateCollectionPhasesRequest} collection - The request object for updating the collection phases.
   * @returns {Promise<InscriptionCollectionCreateResponse>} A promise resolving with the updated collection response.
   */
  async updateCollectionPhases(
    collection: UpdateCollectionPhasesRequest
  ): Promise<InscriptionCollectionCreateResponse> {
    return this.instanceV1.post(`/updatecollectionphases`, {
      ...collection
    });
  }

  /**
   * Fetch the allocation and inscribedCount of reciever address by phases from collection.
   * @param {GetAllocationRequest} allocation - The request object for get allocation.
   * @returns {Promise<GetAllocationResponse>} A promise resolving with the phases response.
   */
  async getAllocation(
    allocation: GetAllocationRequest
  ): Promise<GetAllocationResponse> {
    return this.instanceV1.post(`/getallocation`, allocation);
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
   * Creates an runes etch order.
   * @param {RunesEtchOrderRequest} order - The request object for creating the runes etch order.
   * @returns {Promise<RunesEtchOrder>} A promise resolving with the created runes etch order.
   */
  async createRunesEtchOrder(
    order: RunesEtchOrderRequest
  ): Promise<RunesEtchOrderResponse> {
    return this.instanceV1.post(`/runes/etch`, order);
  }

  /**
   * Creates an runes mint order.
   * @param {RunesMintOrderRequest} order - The request object for creating the runes mint order.
   * @returns {Promise<RunesMintOrder>} A promise resolving with the created runes mint order.
   */
  async createRunesMintOrder(
    order: RunesMintOrderRequest
  ): Promise<RunesMintOrderResponse> {
    return this.instanceV1.post(`/runes/mint`, order);
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

  /**
   * Creates a parent-child PSBT (Partially Signed Bitcoin Transaction).
   * 
   * @param {CreateParentChildPsbtRequest} createParentChildPsbtRequest - The request object containing parameters to create the parent-child PSBT.
   * @returns {Promise<CreateParentChildPsbtResponse>} - A promise that resolves to the response object containing the created parent-child PSBT.
   */
  async createParentChildPsbt(
    createParentChildPsbtRequest: CreateParentChildPsbtRequest
  ): Promise<CreateParentChildPsbtResponse> {
    return this.instanceV1.post(`/create-parent-child-psbt`, {
      ...createParentChildPsbtRequest,
    });
  }
}

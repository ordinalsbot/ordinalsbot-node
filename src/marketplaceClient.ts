import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "./inscription/error";
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
  MarketplaceConfirmListingRequest,
  MarketplaceConfirmListingResponse,
  MarketplaceReListingRequest,
  MarketplaceReListingResponse,
  MarketplaceConfirmReListRequest,
  MarketplaceConfirmReListResponse,
  MarketplaceDeListRequest,
  MarketplaceDeListAPIResponse,
  MarketplaceConfirmDeListRequest,
  MarketplaceConfirmDeListResponse,
} from "./types/marketplace_types";
import { ClientOptions, InscriptionEnv } from "./types";
import { setupL402Interceptor } from "l402";

export class MarketPlaceClient {
  public env: InscriptionEnv;
  private api_key: string;
  private instanceV1: AxiosInstance;

  /**
   * Creates a new Marketplace instance.
   * @param {string} [key=''] - The API key for authentication.
   * @param {InscriptionEnv} [environment='live'] - The environment (live or dev) (optional, defaults to live).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
   */
  constructor(key: string = "", environment: InscriptionEnv = "live", options?: ClientOptions) {
    this.api_key = key;
    this.env = environment;

    /**
     * Creates a new Axios instance with appropriate headers.
     * @returns {AxiosInstance} The new Axios instance.
     */
    const createInstance = (): AxiosInstance => {
      const headers: Record<string, string> = {
        Connection: "Keep-Alive",
        "Content-Type": "application/json",
      };

      // Add the API key header only if this.api_key has a value
      if (this.api_key) {
        headers["x-api-key"] = this.api_key;
      }

      // Choose the base URL based on whether L402 is used or not
      const baseURL = options?.useL402
        ? "https://ordinalsbot.ln.sulu.sh/marketplace/"
        : this.env === "live"
          ? "https://api.ordinalsbot.com/marketplace/"
          : "https://testnet-api.ordinalsbot.com/marketplace/";

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
        setupL402Interceptor(client, options.l402Config.wallet, options.l402Config.tokenStore);
      };

      return client;
    };

    // Create the Axios instance
    this.instanceV1 = createInstance();
  }

  async createMarketPlace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.instanceV1.post(`/create-marketplace`, {
      ...createMarketplaceRequest,
    });
  }

  async createListing(
    createListingRequest: MarketplaceCreateListingRequest
  ): Promise<MarketplaceCreateListingResponse> {
    return this.instanceV1.post(`/create-listing`, {
      ...createListingRequest,
    });
  }

  async createOffer(
    createOfferRequest: MarketplaceCreateOfferRequest
  ): Promise<MarketplaceCreateOfferResponse> {
    return this.instanceV1.post(`/create-offer`, {
      ...createOfferRequest,
    });
  }

  async submitOffer(
    submitOfferRequest: MarketplaceSubmitOfferRequest
  ): Promise<MarketplaceSubmitOfferResponse> {
    return this.instanceV1.post(`/submit-offer`, {
      ...submitOfferRequest,
    });
  }

  async confirmPaddingOutputs(
    confirmPaddingOutputsRequest: MarketplaceConfirmPaddingOutputsRequest
  ): Promise<MarketplaceConfirmPaddingOutputsResponse> {
    return this.instanceV1.post(`/confirm-padding-outputs`, {
      ...confirmPaddingOutputsRequest,
    });
  }

  async setupPaddingOutputs(
    setupPaddingOutputsRequest: MarketplaceSetupPaddingOutputsRequest
  ): Promise<MarketplaceSetupPaddingOutputsResponse> {
    return this.instanceV1.post(`/setup-padding-outputs`, {
      ...setupPaddingOutputsRequest,
    });
  }

  async getListing(
    getListingRequest: MarketplaceGetListingRequest
  ): Promise<MarketplaceGetListingResponse> {
    return this.instanceV1.post(`/get-listing`, { ...getListingRequest });
  }

  async saveListing(
    saveListingRequest: MarketplaceSaveListingRequest
  ): Promise<MarketplaceSaveListingResponse> {
    return this.instanceV1.patch(`/save-listing/${saveListingRequest.ordinalId}`, {
      ...saveListingRequest,
    });
  }

  /**
   * Confirms a listing in the marketplace.
   * @param {MarketplaceConfirmListingRequest} confirmListingRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceSaveListingResponse>} A promise that resolves with the response from confirming the listing.
   */
  async confirmListing(
    confirmListingRequest: MarketplaceConfirmListingRequest
  ): Promise<MarketplaceConfirmListingResponse> {
    return this.instanceV1.post(`/confirm-listing`, {
      ...confirmListingRequest,
    })
  }

  /**
   * Relisting an existing listing ordinal in the marketplace.
   * @param {MarketplaceReListingRequest} reListingRequest - The request object for reListing.
   * @returns {Promise<MarketplaceReListingResponse>} A promise that resolves with the response from relisting.
   */
  async reListing(
    reListingRequest: MarketplaceReListingRequest
  ): Promise<MarketplaceReListingResponse> {
    return this.instanceV1.post(`/relist`, {
      ...reListingRequest,
    });
  }

  /**
   * Confirms relisting in the marketplace.
   * @param {MarketplaceConfirmReListRequest} confirmReListRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceConfirmReListResponse>} A promise that resolves with the response from confirming the listing.
   */
  async confirmReListing(
    confirmReListRequest: MarketplaceConfirmReListRequest
  ): Promise<MarketplaceConfirmReListResponse> {
    return this.instanceV1.post(`/confirm-relist`, {
      ...confirmReListRequest,
    })
  }

  /**
   * deListing the ordinal from marketplace and transfer back to the seller ordinal address.
   * @param {MarketplaceDeListRequest} deListRequest - The request object for deListing.
   * @returns {Promise<MarketplaceDeListAPIResponse>} A promise that resolves with the response from deListing.
   */
  async deList(
    deListRequest: MarketplaceDeListRequest
  ): Promise<MarketplaceDeListAPIResponse> {
    return this.instanceV1.post(`/delist`, {
      ...deListRequest,
    });
  }

  /**
   * Confirms delisting in the marketplace.
   * @param {MarketplaceConfirmDeListRequest} confirmDeListRequest - The request object for confirming the listing.
   * @returns {Promise<MarketplaceConfirmDeListResponse>} A promise that resolves with the response from confirming the listing.
   */
  async confirmDeListing(
    confirmDeListRequest: MarketplaceConfirmDeListRequest
  ): Promise<MarketplaceConfirmDeListResponse> {
    return this.instanceV1.post(`/confirm-delist`, {
      ...confirmDeListRequest,
    })
  }

  /**
   * transfer the ordinal to another ordinal address.
   * @param {MarketplaceTransferRequest} transferRequest - The request object for transfer.
   * @returns {Promise<MarketplaceTransferAPIResponse>} A promise that resolves with the response from transfer.
   */
  async transfer(
    transferRequest: MarketplaceTransferRequest
  ): Promise<MarketplaceTransferAPIResponse> {
    return this.instanceV1.post(`/transfer-ordinal`, {
      ...transferRequest,
    });
  }
}

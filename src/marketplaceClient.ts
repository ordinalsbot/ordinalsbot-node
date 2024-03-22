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
} from "./types/marketplace_types";
import { InscriptionEnv } from "./types";

export class MarketPlaceClient {
  public env: InscriptionEnv;
  private api_key: string;
  private instanceV1: AxiosInstance;

  constructor(key: string = "", environment: InscriptionEnv = "live") {
    this.api_key = key;
    this.env = environment;

    const createInstance = (): AxiosInstance => {

      const headers: Record<string, string> = {
        Connection: "Keep-Alive",
        "Content-Type": "application/json",
      };
      
      // Add the API key header only if this.api_key has a value
      if (this.api_key) {
        headers["x-api-key"] = this.api_key;
      }
      
      const client = axios.create({
        baseURL: this.env === "live"
          ? `https://api.ordinalsbot.com/marketplace/`
          : `https://testnet-api.ordinalsbot.com/marketplace/`,
        headers: headers
      });
      
      client.interceptors.response.use(
        ({ data }) => ("data" in data ? data.data : data),
        (err) => {
          if (axios.isAxiosError(err)) {
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

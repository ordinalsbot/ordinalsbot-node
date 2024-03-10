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
  MarketplaceTransferResponse,
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

  async transfer(
    transferRequest: MarketplaceTransferRequest
  ): Promise<MarketplaceTransferResponse> {
    return this.instanceV1.post(`/transfer-ordinal`, {
      ...transferRequest,
    });
  }
}

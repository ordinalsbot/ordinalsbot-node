import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "./InscriptionError";
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
} from "./types/markeplace_types";
import { InscriptionEnv } from "./types";

export class MarketPlaceClient {
  public env: InscriptionEnv;
  private api_key: string;
  private instanceV1: AxiosInstance;

  constructor(key: string = "", environment: InscriptionEnv = "live") {
    this.api_key = key;
    this.env = environment;

    const createInstance = (): AxiosInstance => {
      const client = axios.create({
        baseURL:
          environment === "live"
            ? `https://api.ordinalsbot.com/marketplace/`
            : `https://testnet-api.ordinalsbot.com/marketplace/`,
        headers: {
          "x-api-key": this.api_key,
          Connection: "Keep-Alive",
          "Content-Type": "application/json",
        },
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
      params: createMarketplaceRequest,
    });
  }

  async createListing(
    createListingRequest: MarketplaceCreateListingRequest
  ): Promise<MarketplaceCreateListingResponse> {
    return this.instanceV1.post(`/create-listing`, {
      params: createListingRequest,
    });
  }

  async createOffer(
    createOfferRequest: MarketplaceCreateOfferRequest
  ): Promise<MarketplaceCreateOfferResponse> {
    return this.instanceV1.post(`/create-offer`, {
      params: createOfferRequest,
    });
  }

  async submitOffer(
    submitOfferRequest: MarketplaceSubmitOfferRequest
  ): Promise<MarketplaceSubmitOfferResponse> {
    return this.instanceV1.post(`/submit-offer`, {
      params: submitOfferRequest,
    });
  }

  async confirmPaddingOutputs(
    confirmPaddingOutputsRequest: MarketplaceConfirmPaddingOutputsRequest
  ): Promise<MarketplaceConfirmPaddingOutputsResponse> {
    return this.instanceV1.post(`/confirm-padding-outputs`, {
      params: confirmPaddingOutputsRequest,
    });
  }

  async setupPaddingOutputs(
    setupPaddingOutputsRequest: MarketplaceSetupPaddingOutputsRequest
  ): Promise<MarketplaceSetupPaddingOutputsResponse> {
    return this.instanceV1.post(`/setup-padding-outputs`, {
      params: setupPaddingOutputsRequest,
    });
  }

  async getListing(
    getListingRequest: MarketplaceGetListingRequest
  ): Promise<MarketplaceGetListingResponse> {
    return this.instanceV1.get(`/get-listing`, { params: getListingRequest });
  }

  async saveListing(
    saveListingRequest: MarketplaceSaveListingRequest
  ): Promise<MarketplaceSaveListingResponse> {
    return this.instanceV1.patch(`/save-listing`, {
      params: saveListingRequest,
    });
  }
}

import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "./InscriptionError";
import {
  MarketplaceCheckPaddingOutputRequest,
  MarketplaceCheckPaddingOutputResponse,
  MarketplaceCreateBuyOfferRequest,
  MarketplaceCreateBuyOfferResponse,
  MarketplaceCreatePaddingOutputsRequest,
  MarketplaceCreatePaddingOutputsResponse,
  MarketplaceCreateRequest,
  MarketplaceCreateResponse,
  MarketplaceGetListingResponse,
  MarketplaceListOridnalForSaleRequest,
  MarketplaceListOridnalForSaleResponse,
  MarketplaceSubmitBuyOfferRequest,
  MarketplaceSubmitBuyOfferResponse,
} from "./types/markeplace_types";
import { InscriptionEnv } from "./types";

interface CustomHeaders {
  "Connection": string;
  "Content-Type": string;
  "x-api-key"?: string; // Optional header
}

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
      params: createMarketplaceRequest,
    });
  }

  async listSaleForOrdinal(
    listSaleForOrdinalRequest: MarketplaceListOridnalForSaleRequest
  ): Promise<MarketplaceListOridnalForSaleResponse> {
    return this.instanceV1.post(`/create-listing`, {
      params: listSaleForOrdinalRequest,
    });
  }

  async createBuyOffer(
    createBuyOfferRequest: MarketplaceCreateBuyOfferRequest
  ): Promise<MarketplaceCreateBuyOfferResponse> {
    return this.instanceV1.post(`/create-offer`, {
      params: createBuyOfferRequest,
    });
  }

  async submitBuyOffer(
    submitBuyOfferRequest: MarketplaceSubmitBuyOfferRequest
  ): Promise<MarketplaceSubmitBuyOfferResponse> {
    return this.instanceV1.post(`/submit-offer`, {
      params: submitBuyOfferRequest,
    });
  }

  async checkPaddingOutput(
    checkPaddingOutputRequest: MarketplaceCheckPaddingOutputRequest
  ): Promise<MarketplaceCheckPaddingOutputResponse> {
    return this.instanceV1.post(`/confirm-padding-outputs`, {
      params: checkPaddingOutputRequest,
    });
  }

  async createPaddingOutput(
    createPaddingOutputRequest: MarketplaceCreatePaddingOutputsRequest
  ): Promise<MarketplaceCreatePaddingOutputsResponse> {
    return this.instanceV1.post(`/setup-padding-outputs`, {
      params: createPaddingOutputRequest,
    });
  }

  async getListing(): Promise<MarketplaceGetListingResponse> {
    return this.instanceV1.get(`/get-listing`);
  }
}

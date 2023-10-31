import axios, { AxiosInstance } from "axios";
import { OrdinalsBotError } from "./OrdinalsBotError";
import { OrdinalsBotEnv } from "./types";
import {
  OrdinalsBotPriceRequest,
  OrdinalsBotPriceResponse,
  OrdinalsBotOrderRequest,
  OrdinalsBotOrder,
  OrdinalsBotCollectionCreateRequest,
  OrdinalsBotCollectionCreateResponse,
  OrdinalsBotCollectionOrderRequest,
  OrdinalsBotTextOrderRequest,
  OrdinalsBotInventoryResponse,
  OrdinalsBotReferralRequest,
  OrdinalsBotReferralSetResponse,
  OrdinalsBotReferralStatusResponse,
} from "./types/v1";

const version = require("../package.json")?.version || "local";
const packageVersion = `npm-ordinalsbot-v${version}`;

export class OrdinalsBotClient {
  public env: OrdinalsBotEnv;

  private api_key: string;
  private instanceV1: AxiosInstance;

  constructor(key: string = "", environment: OrdinalsBotEnv = "live") {
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
            throw new OrdinalsBotError(
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

  async getPrice(
    priceRequest: OrdinalsBotPriceRequest
  ): Promise<OrdinalsBotPriceResponse> {
    return this.instanceV1.get(`/order`, {
      params: priceRequest,
    });
  }

  async createOrder(order: OrdinalsBotOrderRequest): Promise<OrdinalsBotOrder> {
    return this.instanceV1.post(`/order`, order);
  }

  async getOrder(id: string): Promise<OrdinalsBotOrder> {
    return this.instanceV1.get(`/order`, {
      params: { id },
    });
  }

  async createCollection(
    collection: OrdinalsBotCollectionCreateRequest
  ): Promise<OrdinalsBotCollectionCreateResponse> {
    return this.instanceV1.post(`/collection-create`, collection);
  }

  async createCollectionOrder(
    collectionOrder: OrdinalsBotCollectionOrderRequest
  ): Promise<OrdinalsBotOrder> {
    return this.instanceV1.post(`/collection-order`, collectionOrder);
  }

  async createTextOrder(
    order: OrdinalsBotTextOrderRequest
  ): Promise<OrdinalsBotOrder> {
    return this.instanceV1.post(`/text-order`, order);
  }

  async getInventory(): Promise<OrdinalsBotInventoryResponse[]> {
    return this.instanceV1.get(`/inventory`);
  }

  async setReferralCode(
    referral: OrdinalsBotReferralRequest
  ): Promise<OrdinalsBotReferralSetResponse> {
    return this.instanceV1.post(`/referrals`, referral);
  }

  async getReferralStatus(
    referral: OrdinalsBotReferralRequest
  ): Promise<OrdinalsBotReferralStatusResponse> {
    return this.instanceV1.get(`/referrals`, {
      params: referral,
    });
  }
}

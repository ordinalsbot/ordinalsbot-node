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

const qs = require("qs");
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
    return this.instanceV1.get(`/price`, {
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
    let data = qs.stringify(plainObject);
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

  async createCollectionOrder(
    collectionOrder: OrdinalsBotCollectionOrderRequest
  ): Promise<OrdinalsBotOrder> {
    return this.instanceV1.post(`/collectionorder`, collectionOrder);
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

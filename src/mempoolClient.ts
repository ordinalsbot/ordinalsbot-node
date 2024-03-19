import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "./InscriptionError";
import {
  MempoolAddressUtxoResponse,
  RecommendedFees,
} from "./types/mempool_types";
import { InscriptionEnv } from "./types";

export class MempoolClient {
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
          ? `https://api.ordinalsbot.com/mempool/`
          : `https://testnet-api.ordinalsbot.com/mempool/`,
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

  async getFeeEstimation(): Promise<RecommendedFees> {
    return this.instanceV1.get("api/v1/fees/recommended");
  }

  async getAddressUtxo(
    address: string,
  ): Promise<MempoolAddressUtxoResponse[]> {
    return this.instanceV1.get(`api/address/${address}/utxo`);
  }
}

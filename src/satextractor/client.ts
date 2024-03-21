import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "../inscription/error";
import {
  SatextractorExtractRequest,
  SatextractorExtractResponse,
} from "../types/satextractor_types";
import { InscriptionEnv } from "../types";

/**
 * A client for interacting with the Satextractor API.
 */
export class SatextractorClient {
  /**
   * The environment for the Satextractor API (live or dev).
   */
  public env: InscriptionEnv;

  /**
   * The API key used for authentication.
   */
  private api_key: string;

  /**
   * The Axios instance for making HTTP requests.
   */
  private instanceV1: AxiosInstance;

  /**
   * Creates a new SatextractorClient instance.
   * @param {string} [key=''] - The API key (optional).
   * @param {InscriptionEnv} [environment='live'] - The environment (live or dev) (optional, defaults to live).
   */
  constructor(key: string = "", environment: InscriptionEnv = "live") {
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

      const client = axios.create({
        baseURL:
          this.env === "live"
            ? `https://api.ordinalsbot.com/satextractor/`
            : `https://testnet-api.ordinalsbot.com/satextractor/`,
        headers: headers,
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

  /**
   * Extracts data using the Satextractor API.
   * @param {SatextractorExtractRequest} extractRequest - The request object for data extraction.
   * @returns {Promise<SatextractorExtractResponse>} A promise that resolves to the extraction response.
   */
  async extract(
    extractRequest: SatextractorExtractRequest
  ): Promise<SatextractorExtractResponse> {
    return this.instanceV1.post(`/extract`, {
      ...extractRequest,
    });
  }
}

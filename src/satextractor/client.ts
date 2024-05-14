import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "../inscription/error";
import {
  SatextractorExtractRequest,
  SatextractorExtractResponse,
} from "../types/satextractor_types";
import { ClientOptions, InscriptionEnv } from "../types";
import { setupL402Interceptor } from "l402";

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
   * Creates a new Satextractor instance.
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
        ? "https://ordinalsbot.ln.sulu.sh/satextractor/"
        : this.env === "live"
          ? "https://api.ordinalsbot.com/satextractor/"
          : "https://testnet-api.ordinalsbot.com/satextractor/";

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

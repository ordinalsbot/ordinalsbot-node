import axios, { AxiosInstance } from "axios";
import { InscriptionError } from "../inscription/error";
import { SatscannerSpecialRangesRequest, SatscannerSpecialRangesResponse, SatscannerSpecialRangesUtxoRequest } from "../types/satscanner_types";
import { InscriptionEnv, ClientOptions, EnvNetworkExplorer, InscriptionEnvNetwork } from "../types";
import { setupL402Interceptor } from "l402"; 



/**
 * A client for interacting with the Satscanner API.
 */
export class SatscannerClient {
  /**
   * The environment for the Satscanner API (e.g., "testnet" , "mainnet", "signet").
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
   * Creates a new SatscannerClient instance.
   * @param {string} [key=''] - The API key for authentication.
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
   */
  constructor(key: string = "", environment: InscriptionEnv = InscriptionEnvNetwork.mainnet, options?: ClientOptions) {
    this.api_key = key;
    environment = InscriptionEnvNetwork[environment]??InscriptionEnvNetwork.mainnet;
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
        ? "https://ordinalsbot.ln.sulu.sh/satscanner/"
        : `${EnvNetworkExplorer[this.env] || EnvNetworkExplorer.mainnet}/satscanner/`;

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
   * Retrieves the supported Satributes.
   * @returns {Promise<string[]>} A promise that resolves to an array of supported Satributes.
   */
  async getSupportedSatributes(): Promise<string[]> {
    return this.instanceV1.get(`/supported-satributes`);
  }

  /**
   * Finds special ranges using the Satscanner API.
   * @param {SatscannerSpecialRangesRequest} findSpecialRangesRequest - The request object for finding special ranges.
   * @returns {Promise<SatscannerSpecialRangesResponse>} A promise that resolves to the special ranges response.
   */
  async findSpecialRanges(
    findSpecialRangesRequest: SatscannerSpecialRangesRequest
  ): Promise<SatscannerSpecialRangesResponse> {
    return this.instanceV1.get(`/find-special-ranges`, {
      params: findSpecialRangesRequest,
    });
  }

  /**
   * Finds special ranges UTXO using the Satscanner API.
   * @param {SatscannerSpecialRangesUtxoRequest} findSpecialRangesRequestUtxo - The request object for finding special ranges UTXO.
   * @returns {Promise<SatscannerSpecialRangesResponse>} A promise that resolves to the special ranges UTXO response.
   */
  async findSpecialRangesUtxo(
    findSpecialRangesRequestUtxo: SatscannerSpecialRangesUtxoRequest
  ): Promise<SatscannerSpecialRangesResponse> {
    return this.instanceV1.post(`/find-special-ranges-utxo`, {
      ...findSpecialRangesRequestUtxo,
    });
  }
}

import axios, { AxiosInstance } from "axios";
import { ClientOptions, EnvNetworkExplorer, InscriptionEnv, InscriptionEnvNetwork } from "../types";
import {
  AccountWithdrawRequest,
  AccountWithdrawResponse,
  CheckTransactionAsTxidRequest,
  CheckTransactionAsTxidResponse,
  CreatePaymentPSBTRequest,
  CreatePaymentPSBTResponse,
  CreateRuneOrderRequest,
  GetAccountWithdrawRequest,
  GetOrderRequest,
  GetOrderResponse,
  RuneOrderResponse,  
} from "../types/tokenpay_types";
import { InscriptionError } from "../inscription/error";
import { setupL402Interceptor } from "l402";

/**
 * A client for interacting with the TokenPay API.
 */
export class TokenPayClient {
  /**
   * The environment for the API (e.g., "testnet" , "mainnet", "signet").
   */
  public env: InscriptionEnv;

  /**
   * The API key used for authentication.
   */
  private api_key: string;

  /**
   * The Axios instance for making API requests.
   */
  private instanceV1: AxiosInstance;

  /**
   * Creates a new TokenPay instance.
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
        "Content-Type": "application/json",
      };

      // Add the API key header only if this.api_key has a value
      if (this.api_key) {
        headers["x-api-key"] = this.api_key;
      }

      // Choose the base URL based on whether L402 is used or not
      const baseURL = options?.useL402
        ? "https://ordinalsbot.ln.sulu.sh/tokenpay/"
        : `${EnvNetworkExplorer[this.env] || EnvNetworkExplorer.mainnet}/tokenpay/`;
      

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
        setupL402Interceptor(client as any, options.l402Config.wallet, options.l402Config.tokenStore);
      };

      return client;
    };

    // Create the Axios instance
    this.instanceV1 = createInstance();
  }

  /**
   * Creates a new order.
   * @param {CreateRuneOrderRequest} createRuneOrderRequest The request body for creating a order.
   * @returns {Promise<RuneOrderResponse>} A promise that resolves to the response from the API.
   */
  async createRuneOrder(
    createRuneOrderRequest: CreateRuneOrderRequest
  ): Promise<RuneOrderResponse> {
    return this.instanceV1.post(`/user/order/rune`, {
      ...createRuneOrderRequest,
    });
  }

  /**
   * Creates a Payment Partially Signed Bitcoin Transaction (PSBT) for the given request.
   *
   * @param {CreatePaymentPSBTRequest} createPaymentRequest - The request object containing the details needed to create the payment PSBT.
   * @returns {Promise<CreatePaymentPSBTResponse>} A promise that resolves to the response of the created payment PSBT.
   */
  async createPaymentPSBT(
    createPaymentRequest: CreatePaymentPSBTRequest
  ): Promise<CreatePaymentPSBTResponse> {
    return this.instanceV1.post(`/create-payment-psbt`, {
      ...createPaymentRequest,
    });
  }

  /**
   * Checks the transaction status using the provided transaction ID (txid).
   * 
   * @param {CheckTransactionAsTxidRequest} checkTransactionAsTxidRequest - The request object containing the transaction ID to be checked.
   * @returns {Promise<CheckTransactionAsTxidResponse>} A promise that resolves to the response containing the transaction status.
   */
  async checkTransactionAsTxid(
    checkTransactionAsTxidRequest: CheckTransactionAsTxidRequest
  ): Promise<CheckTransactionAsTxidResponse> {
    return this.instanceV1.post(`/utils/checktx`, {
      ...checkTransactionAsTxidRequest,
    });
  }

  /**
   * Retrieves the details of an order.
   * 
   * @param {GetOrderRequest} getOrderRequest - The request object containing the order ID.
   * @returns {Promise<GetOrderResponse>} A promise that resolves to the order response.
   */
  async getOrder(
    getOrderRequest: GetOrderRequest
  ): Promise<GetOrderResponse> {
    return this.instanceV1.get(
      `/order/${getOrderRequest.orderId}`
    );
  }

  /**
   * Initiates an account withdrawal request.
   * 
   * @param {AccountWithdrawRequest} accountWithdrawRequest - The request object containing the withdrawal details.
   * @returns {Promise<AccountWithdrawResponse>} A promise that resolves to the account withdrawal response.
   */
  async accountWithdraw(
    accountWithdrawRequest: AccountWithdrawRequest
  ): Promise<AccountWithdrawResponse> {
    return this.instanceV1.post(`/user/account/withdraw`, {
      ...accountWithdrawRequest,
    });
  }

  /**
   * Retrieves the account withdrawal details.
   * 
   * @param {GetAccountWithdrawRequest} getAccountWithdrawRequest - The request object containing the withdrawal ID.
   * @returns {Promise<AccountWithdrawResponse>} A promise that resolves to the account withdrawal response.
   */
  async getAccountWithdraw(
    getAccountWithdrawRequest: GetAccountWithdrawRequest
  ): Promise<AccountWithdrawResponse> {
    return this.instanceV1.get(
      `/user/account/withdraw/${getAccountWithdrawRequest.withdrawalId}`
    );
  }
}

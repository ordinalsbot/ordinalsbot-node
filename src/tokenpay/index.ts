import { ClientOptions, InscriptionEnv, InscriptionEnvNetwork } from "../types";
import { TokenPayClient } from "./client";
import {
  BitcoinNetworkType,
  SignTransactionPayload,
  SignTransactionResponse,
  signTransaction,
} from "sats-connect";
import {
  CreatePaymentPSBTRequest,
  CreatePaymentPSBTResponse,
  CreateOrderRequest,
  OrderResponse,
  SatsConnectWrapperResponse,
} from "../types/tokenpay_types";
import { WALLET_PROVIDER } from "../types/marketplace_types";

/**
 * A class for interacting with the TokenPay API's.
 */
export class TokenPay {
  /**
   * The Bitcoin network type to use ('Mainnet', 'Testnet' or 'Signet').
   */
  private network: BitcoinNetworkType;
  /**
   * The instance of TokenPayClient used to make API requests.
   */
  private tokenpayClientInstance!: TokenPayClient;

  /**
   * Creates an instance of TokenPay.
   * @param key The API key (optional).
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
   */
  constructor(
    key: string = "",
    environment: InscriptionEnv = InscriptionEnvNetwork.mainnet,
    options?: ClientOptions
  ) {
    if (this.tokenpayClientInstance !== undefined) {
      console.error("tokenpay constructor was called multiple times");
      return;
    }

    environment =
      InscriptionEnvNetwork[environment] ?? InscriptionEnvNetwork.mainnet;
    switch (environment) {
      case InscriptionEnvNetwork.mainnet:
        this.network = BitcoinNetworkType.Mainnet;
        break;
      case InscriptionEnvNetwork.testnet:
        this.network = BitcoinNetworkType.Testnet;
        break;
      case InscriptionEnvNetwork.signet:
        // this.network = '';
        break;

      default:
        this.network = BitcoinNetworkType.Mainnet;
        break;
    }
    this.tokenpayClientInstance = new TokenPayClient(key, environment, options);
  }

  /**
   * Creates a new order.
   * @param {CreateOrderRequest} createOrderRequest The request body for creating a order.
   * @returns {Promise<OrderResponse>} A promise that resolves to the response from the API.
   */
  createOrder(createOrderRequest: CreateOrderRequest): Promise<OrderResponse> {
    return this.tokenpayClientInstance.createOrder(createOrderRequest);
  }

  /**
   * Creates a payment PSBT (Partially Signed Bitcoin Transaction) based on the provided request.
   * If a wallet provider is specified, it signs the PSBT using the appropriate wallet.
   *
   * @param {CreatePaymentPSBTRequest} createPaymentPSBTRequest - The request object containing details to create the payment PSBT.
   * @returns {Promise<CreatePaymentPSBTResponse | SignTransactionResponse>} A promise that resolves to either a CreatePaymentPSBTResponse or SignTransactionResponse object.
   * @throws {Error} If the wallet provider is not supported.
   */
  async createPaymentPSBT(
    createPaymentPSBTRequest: CreatePaymentPSBTRequest
  ): Promise<CreatePaymentPSBTResponse | SignTransactionResponse> {
    if (!createPaymentPSBTRequest.walletProvider) {
      return this.tokenpayClientInstance.createPaymentPSBT(createPaymentPSBTRequest);
    } else if (createPaymentPSBTRequest.walletProvider === WALLET_PROVIDER.xverse) {
      const paymentPSBTResponse: CreatePaymentPSBTResponse = await this.tokenpayClientInstance.createPaymentPSBT(createPaymentPSBTRequest);
      const inputsToSign = {
        address: createPaymentPSBTRequest.paymentAddress,
        signingIndexes: paymentPSBTResponse.inputIndicesToSign,
      };

      const payload = {
        network: {
          type: this.network,
        },
        message: "Sign Payment PSBT Transaction",
        psbtBase64: paymentPSBTResponse.psbtBase64,
        broadcast: true,
        inputsToSign: [inputsToSign],
      };

      return new Promise(async (resolve, reject) => {
        const response: SatsConnectWrapperResponse =
          await this.satsConnectWrapper(payload);
        if (response && response.success && response.psbtBase64) {
          resolve({ psbtBase64: response.psbtBase64, txId: response.txId });
        } else {
          console.log("Transaction canceled");
        }
      });
    } else {
      throw new Error("Wallet not supported");
    }
  }

  /**
   * Wraps the signTransaction function to handle the transaction signing process.
   *
   * @param {SignTransactionPayload} payload - The payload containing the transaction details.
   * @returns {Promise<SatsConnectWrapperResponse>} A promise that resolves to a SatsConnectWrapperResponse object.
   */
  async satsConnectWrapper(
    payload: SignTransactionPayload
  ): Promise<SatsConnectWrapperResponse> {
    return new Promise((resolve, reject) => {
      signTransaction({
        payload,
        onFinish: async (response) => {
          resolve({
            success: true,
            message: "Transaction successful",
            ...response,
          });
        },
        onCancel: () => {
          resolve({ success: false, message: "Transaction cancelled" });
        },
      });
    });
  }

}

/**
 * Represents a request to create an rune order.
 *
 * @interface CreateRuneOrderRequest
 */
export interface CreateRuneOrderRequest {
  /**
   * The amount for the order.
   *
   * @type {number}
   */
  amount: number;

  /**
   * The token associated with the order.
   *
   * @type {string}
   */
  token: string;

  /**
   * The webhook Url
   *
   * @type {string}
   */
  webhookUrl?: string;
  
  /**
   * The Additional Fee
   *
   * @type {number}
   */
  additionalFee?: number;

  /**
   * The description for the order
   *
   * @type {string}
   */
  description?: string;
}

/**
 * Represents a fee or token charge.
 *
 * @interface Charge
 */
interface Charge {
  /**
   * The amount of the charge.
   *
   * @type {number}
   */
  amount: number;

  /**
   * The token associated with the charge.
   *
   * @type {string}
   */
  token: string;

  /**
   * The address associated with the charge.
   *
   * @type {string}
   */
  address: string;

  /**
   * The state of the charge.
   *
   * @type {string}
   */
  state: string;

  /**
   * The protocol used for the charge.
   *
   * @type {string}
   */
  protocol: string;

  /**
   * The transaction ID of the charge.
   *
   * @type {string | null}
   */
  txid: string | null;

  /**
   * The creation timestamp of the charge.
   *
   * @type {number}
   */
  createdAt: number;

  /**
   * The additional of the charge.
   *
   * @type {number}
   */
  additionalFee: number;
}

/**
 * Represents an order.
 *
 * @interface RuneOrderResponse
 */
export interface RuneOrderResponse {
  /**
   * The ID of the order.
   *
   * @type {string}
   */
  id: string;

  /**
   * The creation timestamp of the order.
   *
   * @type {number}
   */
  createdAt: number;

  /**
   * The account ID associated with the order.
   *
   * @type {string}
   */
  accountId: string;

  /**
   * The fee charge details.
   *
   * @type {Charge}
   */
  feeCharge: Charge;

  /**
   * The token charge details.
   *
   * @type {Charge}
   */
  tokenCharge: Charge;

  /**
   * The webhook URL for the order.
   *
   * @type {string | null}
   */
  webhookUrl: string | null;

  /**
   * The state of the order.
   *
   * @type {string}
   */
  state: string;

  /**
   * The description for the order.
   *
   * @type {string | null}
   */
  description: string | null;
}

/**
 * Interface representing a request to create a Payment Partially Signed Bitcoin Transaction (PSBT).
 */
export interface CreatePaymentPSBTRequest {
  /**
   * The unique identifier for the order.
   * @type {string}
   */
  orderId: string;

  /**
   * The address to which the payment will be made.
   * @type {string}
   */
  paymentAddress: string;

  /**
   * The public key associated with the payment.
   * @type {string}
   */
  paymentPublicKey: string;

  /**
   * The ordinal address.
   * @type {string}
   */
  ordinalAddress: string;

  /**
   * The ordinal public key.
   * @type {string}
   */
  ordinalPublicKey: string;

  /**
   * The fee rate for the transaction, specified in satoshis per byte.
   * This field is optional.
   * @type {number}
   * @optional
   */
  feeRate?: number;

  /**
   * Wallet Provider name
   * This field is optional.
   * @type {string}
   * @optional
   */
  walletProvider?: string;
}

/**
 * Interface representing a rune input.
 */
interface RuneInput {
  /**
   * An array of indices for the rune inputs.
   * @type {number[]}
   */
  indices: number[];

  /**
   * The address associated with the rune inputs.
   * @type {string}
   */
  address: string;
}

/**
 * Interface representing the inputs for a payment.
 */
interface PaymentInputs {
  /**
   * An array of indices for the payment inputs.
   * @type {number[]}
   */
  indices: number[];

  /**
   * The address associated with the payment inputs.
   * @type {string}
   */
  address: string;
}

/**
 * Interface representing the response from creating a Payment Partially Signed Bitcoin Transaction (PSBT).
 */
export interface CreatePaymentPSBTResponse {
  /**
   * The PSBT encoded in Base64 format.
   * @type {string}
   */
  psbtBase64: string;

  /**
   * The rune input used in the PSBT.
   * @type {RuneInput}
   */
  runeInputs: RuneInput;

  /**
   * The payment inputs used in the PSBT.
   * @type {PaymentInputs}
   */
  paymentInputs: PaymentInputs;

  /**
   * The PSBT encoded in hexadecimal format.
   * @type {string}
   */
  psbtHex: string;
}

/**
 * Represents the response from a SatsConnectWrapper operation.
 */
export interface SatsConnectWrapperResponse {
  /**
   * Indicates if the operation was successful.
   */
  success: boolean;

  /**
   * A message describing the result of the operation.
   */
  message: string;

  /**
   * (Optional) The PSBT (Partially Signed Bitcoin Transaction) in Base64 format.
   */
  psbtBase64?: string;

  /**
   * (Optional) The transaction ID.
   */
  txId?: string;
}

/**
 * Represents the request payload from a CheckTransactionAsTxid method.
 */
export interface CheckTransactionAsTxidRequest {
  /**
   * The transaction ID.
   */
  txid: string;
}

/**
 * Represents the response from a CheckTransactionAsTxidResponse operation.
 */
export interface CheckTransactionAsTxidResponse {
  /**
   * The transaction ID.
   */
  txid: string;
}

/**
 * Represents the request payload from a getOrder method.
 */
export interface GetOrderRequest {
  /**
   * The order ID.
   */
  orderId: string;
}

/**
 * Represents the response from a CheckTransactionAsTxidResponse operation.
 */
export interface GetOrderResponse extends RuneOrderResponse {
  // ... response from RuneOrderResponse
}

/**
 * Interface representing a request to withdraw an account.
 */
export interface AccountWithdrawRequest {
  /**
   * The protocol used for the withdraw (e.g., "rune").
   */
  protocol: string;

  /**
   * The token to be withdrawn (e.g., 'SHITCOIN').
   */
  token: string;

  /**
   * The amount of the token to be withdrawn.
   */
  amount: number;

  /**
   * The address to which the token will be sent.
   */
  address: string;
}

/**
 * Represents the response from a AccountWithDraw Response operation.
 */
export interface AccountWithdrawResponse {
  /**
   * The unique identifier for the withdraw.
   */
  id: string;

  /**
   * The timestamp when the withdraw was created.
   */
  createdAt: number;

  /**
   * The account ID associated with the withdraw.
   */
  accountId: string;

  /**
   * The protocol used for the withdraw (e.g., "rune").
   */
  protocol: string;

  /**
   * The token involved in the withdraw (e.g., "SHITCOIN").
   */
  token: string;

  /**
   * The amount of the token being transacted.
   */
  amount: number;

  /**
   * The address to which the withdraw is sent.
   */
  address: string;

  /**
   * The current state of the withdraw.
   */
  state: string;

  /**
   * The withdraw ID (if available).
   */
  txid: string | null;

  /**
   * The fee charged by the blockchain network for processing the withdraw (if available).
   */
  chainFee: number | null;

  /**
   * The number of attempts made to process the withdraw.
   */
  tries: number;

  /**
   * The timestamp when the withdraw started processing (in milliseconds since epoch, if available).
   */
  processingAt: number | null;

  /**
   * The fee per byte for the withdraw (if available).
   */
  feePerByte: number | null;
}


/**
 * Represents the request payload from a getAccountWithdraw method.
 */
export interface GetAccountWithdrawRequest {
  /**
   * The unique identifier for the withdraw .
   */
  withdrawalId: string;
}

/**
 * Represents a rune token balances.
 * Each key in the object is a rune token type, and the value is the balance.
 */
interface RuneTokenBalance {
  [key: string]: number;
}

/**
 * Represents account balances where each key is a unique account identifier.
 * The value for each key is a `CoinData` object, which contains the balances of various coins for that account.
 */
export interface AccountBalanceResponse {
  [key: string]: RuneTokenBalance;
}
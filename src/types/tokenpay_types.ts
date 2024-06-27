/**
 * Represents a request to create an order.
 *
 * @interface CreateOrderRequest
 */
export interface CreateOrderRequest {
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
   * The account ID related to the order.
   *
   * @type {string}
   */
  accountId: string;
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
   * The type of the token.
   *
   * @type {string}
   */
  tokenType: string;
}

/**
 * Represents an order.
 *
 * @interface Order
 */
export interface OrderResponse {
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
   * The type of the order.
   *
   * @type {string}
   */
  type: string;

  /**
   * The state of the order.
   *
   * @type {string}
   */
  state: string;
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
 * Interface representing the response from creating a Payment Partially Signed Bitcoin Transaction (PSBT).
 */
export interface CreatePaymentPSBTResponse {
  /**
   * The PSBT encoded in Base64 format.
   * @type {string}
   */
  psbtBase64: string;

  /**
   * An array of indices indicating the inputs to sign in the PSBT.
   * @type {number[]}
   */
  inputIndicesToSign: number[];

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

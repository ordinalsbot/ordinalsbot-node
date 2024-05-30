export enum LISTING_STATUS {
  sold = "Sold",
  active = "Active",
  inactive = "Inactive",
  pending_buyer_confirmation = "Pending Buyer Confirmation",
  pending_seller_confirmation = "Pending Seller Confirmation",
}

export enum WALLET_PROVIDER {
  xverse = "Xverse",
}

export interface MarketplaceCreateRequest {
  /** Name for the marketplace */
  name: string;

  /** Fees to be charged to the seller when listing an ordinal for sale on the marketplace. Fees should be specified in basis points for example 10% would be 1000 */
  sellerFee?: number;

  /** Fees that will be charged to the buyer when an ordinal is sold on the marketplace. Fees should be specified in basis points for example 10% would be 1000 */
  buyerFee?: number;

  /** The address for paying out marketplace fees */
  btcFeePayoutAddress?: string;

  /** URL for the marketplace */
  url?: string;

  /** Short description for the marketplace */
  description?: string;
}

export interface MarketplaceCreateResponse {
  /** Your new marketplace id */
  marketPlaceId: string;

  /** the api key you provided */
  apiKey: string;
}

export interface SellerOrdinal {
  /** Ordinal id for the ordinal to be listed for sale. */
  id?: string;

  /** Sale price of the ordinal in Sats. */
  price: number | string;
}

export interface MarketplaceCreateListingRequest {
  /** An array with a single ordinal object */
  sellerOrdinals: Array<SellerOrdinal>;

  /** The address to receive the sale proceeds when the ordinal is sold. This will be part of the sale transaction that the buyer will sign */
  sellerPaymentAddress?: string;

  /** The public key for the wallet address that owns the ordinal being listed for sale */
  sellerOrdinalPublicKey?: string;

  /** The Oridnal Address that owns the ordinal being listed for sale */
  sellerOrdinalAddress?: string;

  /** Wallet Provider name */
  walletProvider?: string;
}

export interface MarketplaceCreateListingResponse {
  /** base64 transaction to be signed */
  psbt: string;
}

export enum ReeRateTier {
  fastestFee,
  halfHourFee,
  hourFee,
  minimumFee,
}

export interface MarketplaceCreateOfferRequest {
  /** Id of the ordinal to buy. */
  ordinalId: string;

  /** Buyer's payment wallet address. The buyer will need to pay the cost of the transaction from UTXOs belonging to this address. */
  buyerPaymentAddress: string;

  /** Buyer's Ordinal wallet address. The purchased Ordinal will be transferred to this address.. */
  buyerOrdinalAddress: string;

  /** Public Key for buyer's payment wallet address. */
  buyerPaymentPublicKey: string;

  /** Transaction fee rate should be one of the following. Defaults to fastestFee if not specified: fastestFee | halfHourFee | hourFee | minimumFee */
  feeRateTier?: ReeRateTier;

  /** Wallet Provider name */
  walletProvider?: string;
}

export interface MarketplaceCreateOfferResponse {
  /** base64 transaction to be signed */
  psbt: string;

  /** Array of indices of the inputs that need to be signed by the buyer */
  buyerInputIndices: Array<number>;
}

export interface MarketplaceSubmitOfferRequest {
  /** Id of the ordinal to buy. */
  ordinalId: string;

  /** Signed psbt transaction in base64 encoding. This is the output of the creating an offer using /create-offer and singing it using the buyer's payment wallet */
  signedBuyerPSBTBase64: string;
}

export interface MarketplaceSubmitOfferResponse {
  /** transaction id for the purchase transaction */
  txId: string;
}

export interface MarketplaceConfirmPaddingOutputsRequest {
  /** Buyer's payment wallet address. The buyer will need to pay the cost of the transaction from UTXOs belonging to this address. */
  address: string;
}

export interface MarketplaceConfirmPaddingOutputsResponse {
  /** boolean, if padding outputs exist */
  paddingOutputsExist: boolean;
}

export interface MarketplaceSetupPaddingOutputsRequest {
  /** Buyer's payment wallet address. The buyer will need to pay the cost of the transaction from UTXOs belonging to this address. */
  address: string;

  /** Public Key for buyer's payment wallet address. */
  publicKey: string;

  /** Number of dummy padding outputs to create. This defaults to 3 if not specified */
  numOfOutPuts?: number;

  /** Transaction fee rate should be one of the following. Defaults to fastestFee if not specified: fastestFee | halfHourFee | hourFee | minimumFee */
  feeRateTier?: ReeRateTier;

  /** Wallet Provider name */
  walletProvider?: string;
}

export interface MarketplaceSetupPaddingOutputsResponse {
  /** base64 transaction to be signed */
  psbt: string;

  /** Array of indices of the inputs that need to be signed by the buyer */
  buyerInputIndices: Array<number>;
}

/**
 * Request object for the ordinal listing
 */
export interface MarketplaceGetListingRequest {
  /**
   * Filter based on the status.
   */
  filter: { status: LISTING_STATUS };

  /**
   * Starting of the page.
   * Default page is 1
   */
  page?: number;

  /**
   * Records in a single listing result
   * Default page is 1
   */
  itemsPerPage?: number;

  /**
   * sorting the result collection
   * Default sort value is time.
   */
  sort?: string;
}

/**
 * Get market listing response object
 */
export interface MarketplaceGetListingResponse {
  /** Array of the listing */
  results: ListingOrdinal[];
  /** total number records */
  count: number;
  /**current page number */
  currentPage: number;
  /** total pages */
  totalPages: number;
  /** total number of items in the result array */
  totalItems: number;
}

/**
 * Listing ordinal object
 */
interface ListingOrdinal {
  _id: string;
  ordinalId: string;
  price: number;
  sellerPaymentAddress: string;
  sellerOrdinalAddress: string;
  sellerOrdinalPublicKey: string;
  status: string;
  sellerOutputValue: number;
  ordinalUtxoTxId: string;
  ordinalUtxoVout: number;
  indexInSellerPSBT: number;
  marketPlaceId: string;
  marketPlaceMakerFee: number;
  marketPlaceTakerFee: number;
  platformMakerFee: number;
  platformTakerFee: number;
  marketPlaceFeeBtcAddress: string;
  createdAt: string;
  updatedAt: string;
  signedListingPSBT: string;
}

export interface MarketplaceSaveListingRequest {
  ordinalId: String;
  updateListingData: { signedListingPSBT: string };
}

export interface MarketplaceSaveListingResponse {
  /** base64 transaction to be signed */
  psbt: string;
}

/**
 * Request object for confirming a listing in the marketplace.
 */
export interface MarketplaceConfirmListingRequest {
  /**
   * An array of ordinals for the listings to be confirmed.
   */
  sellerOrdinals: Array<string>;
  /**
   * The PSBT (Partially Signed Bitcoin Transaction) for the confirmed listing.
   */
  signedListingPSBT: string;
}
/**
 * Response object for confirming a listing in the marketplace.
 */
export interface MarketplaceConfirmListingResponse {
  /**
   * A message indicating the result of the confirmation operation.
   */
  message: string;
}

/**
 * transfer object.
 */
export interface TransferOrdinal {
  /** Ordinal id for the ordinal to be transfer. */
  ordinalId?: string;

  /** The receiver ordinal address to whom the ordinal will be send. */
  receiverOrdinalAddress: number | string;
}

/**
 * Request object for transfer ordinals.
 */
export interface MarketplaceTransferRequest {
  /** An array with a single ordinal object */
  transfer: Array<string>;

  /** The sender's payment address */
  senderPaymentAddress: string;

  /** The sender's payment public key */
  senderPaymentPublicKey: string;

  /** The sender's ordinal public key */
  senderOrdinalPublicKey: string;

  /** The sender's ordinal address */
  senderOrdinalAddress: string;

  /** Wallet Provider name */
  walletProvider?: string;
}

/**
 * Response object for transfer API.
 */
export interface MarketplaceTransferAPIResponse {
  /** base64 transaction to be signed */
  psbtBase64: string;

  /** Array of Ordinal indices that need to be signed by the Sender  */
  senderOrdinalInputs: Array<number>;

  /** Array of Payment indices that need to be signed by the Sender  */
  senderPaymentInputs: Array<number>;
}

/**
 * Response object for sign transaction.
 */
export interface SignTransactionResponse {
  /** base64 transaction to be signed */
  psbtBase64: string;

  /** transaction id of the transfer */
  txId: string;
}

/**
 * Request object for relist ordinal.
 */
export interface MarketplaceReListingRequest {
  /** existing listing ordinal id for relist */
  ordinalId: string;

  /** updated price for ordinal */
  price: number;

  /** The address to receive the sale proceeds when the ordinal is sold. This will be part of the sale transaction that the buyer will sign */
  sellerPaymentAddress?: string;

  /** The public key for the wallet address that owns the ordinal being listed for sale */
  sellerOrdinalPublicKey?: string;

  /** The Oridnal Address that owns the ordinal being listed for sale */
  sellerOrdinalAddress?: string;

  /** Wallet Provider name */
  walletProvider?: string;
}

/**
 * Response object for relist ordinal.
 */
export interface MarketplaceReListingResponse {
  /** base64 transaction to be signed */
  psbt: string;
}

/**
 * Request object for confirming a relisting in the marketplace.
 */
export interface MarketplaceConfirmReListRequest {
  /**
   * The ordinal id for relist
   */
  ordinalId: string;

  /**
   * The PSBT (Partially Signed Bitcoin Transaction) for the confirmed relist.
   */
  signedListingPSBT: string;
}
/**
 * Response object for confirming a listing in the marketplace.
 */
export interface MarketplaceConfirmReListResponse {
  /**
   * A message indicating the result of the confirmation operation.
   */
  message: string;
}

/**
 * Request object for deList ordinal.
 */
export interface MarketplaceDeListRequest {
  /** ordinal Id to deList */
  ordinalId: string;

  /** The seller's payment address */
  senderPaymentAddress: string;

  /** The seller's payment public key */
  senderPaymentPublicKey: string;

  /** The seller's ordinal address */
  senderOrdinalAddress: string;

  /** Wallet Provider name */
  walletProvider?: string;
}

/**
 * Response object for deList ordinal.
 */
export interface MarketplaceDeListAPIResponse {
  /** base64 transaction to be signed */
  psbtBase64: string;

  /** Array of Ordinal indices that need to be signed by the Seller */
  senderOrdinalInputs: Array<number>;

  /** Array of Payment indices that need to be signed by the Seller */
  senderPaymentInputs: Array<number>;
}

/**
 * Request object for confirming a delisting in the marketplace.
 */
export interface MarketplaceConfirmDeListRequest {
  /**
   * The ordinal id for relist
   */
  ordinalId: string;

  /**
   * seller payment address 
   */
  sellerPaymentAddress: string;
}
/**
 * Response object for confirming a delisting in the marketplace.
 */
export interface MarketplaceConfirmDeListResponse {
  /**
   * A message indicating the result of the confirmation operation.
   */
  message: string;

  /** transaction id of the transfer */
  txId: string | undefined;
}
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
}

export interface MarketplaceCreateOfferResponse {
  psbt: string;
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
}

export interface MarketplaceSetupPaddingOutputsResponse {
  /** base64 transaction to be signed */
  psbt: string;
}

export enum LISTING_STATUS {
  sold = "Sold",
  active = "Active",
  inactive = "Inactive",
  pending_buyer_confirmation = "Pending Buyer Confirmation",
  pending_seller_confirmation = "pending Seller Confirmation",
}

export interface MarketplaceGetListingRequest {
  query: { status: LISTING_STATUS };
}

export interface MarketplaceGetListingResponse {
  ordinals: Array<SellerOrdinal>;
}

export interface MarketplaceSaveListingRequest {
  ordinalId: String;
  updateListingData: { signedListingPSBT: string };
}

export interface MarketplaceSaveListingResponse {
  /** base64 transaction to be signed */
  psbt: string;
}

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
  marketPlaceId: string; // your new marketplace id
  apiKey: string; // the api key you provided
}

/**
 * Represents a request to create a launchpad marketplace.
 */
export interface LaunchpadMarketplaceCreateRequest {
  /** Name for the launchpad marketplace. */
  name: string

  /**
   * Fees to be charged to the seller when listing an ordinal for sale on the launchpad marketplace.
   * Fees should be specified in basis points; for example, 10% would be 1000.
   */
  launchpadSellerFee?: number

  /**
   * Fees that will be charged to the buyer when an ordinal is sold on the launchpad marketplace.
   * Fees should be specified in basis points; for example, 10% would be 1000.
   */
  launchpadBuyerFee?: number

  /** The address for paying out launchpad marketplace fees. */
  launchpadBtcFeePayoutAddress?: string

  /** URL for the launchpad marketplace */
  url?: string

  /** Short description for the launchpad marketplace */
  description?: string
}

/**
 * Represents a response from creating a launchpad marketplace.
 */
export interface LaunchpadMarketplaceCreateResponse {
  /** Your new launchpad marketplace id */
  marketPlaceId: string

  /** the api key you provided */
  apiKey: string
}

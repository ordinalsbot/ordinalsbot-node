/**
 * Represents a request to create a launchpad marketplace.
 */
export interface LaunchpadMarketplaceCreateRequest {
  /** Name for the launchpad marketplace. */
  name: string;

  /**
   * Fees to be charged to the seller when listing an ordinal for sale on the launchpad marketplace.
   * Fees should be specified in basis points; for example, 10% would be 1000.
   */
  launchpadSellerFee?: number;

  /**
   * Fees that will be charged to the buyer when an ordinal is sold on the launchpad marketplace.
   * Fees should be specified in basis points; for example, 10% would be 1000.
   */
  launchpadBuyerFee?: number;

  /** The address for paying out launchpad marketplace fees. */
  launchpadBtcFeePayoutAddress?: string;

  /** URL for the launchpad marketplace */
  url?: string;

  /** Short description for the launchpad marketplace */
  description?: string;
}

/**
 * Represents a response from creating a launchpad marketplace.
 */
export interface LaunchpadMarketplaceCreateResponse {
  /** Your new launchpad marketplace id */
  marketPlaceId: string;

  /** the api key you provided */
  apiKey: string;
}

/**
 * The allowed buyer addresses in the launchpad phase
 */
export interface AllowList {
  /** allow list where the buyer ordinal address as key */
  [key: string]: {
    /** the allowed claims per buyer ordinal address */
    allocation: number;
    /** the total claimed inscriptions by the buyer */
    inscriptionsClaimed?: number;
  };
}

/**
 * launchpad phase object
 */
export interface LaunchpadPhase {
  /** An array of string */
  ordinals: string[];
  /** An object for allow list allocation and claimed inscriptions */
  allowList?: AllowList;
  /** The isPublic key for the phase is public or protected*/
  isPublic: Boolean;
  /** phase price for ordinal to buy */
  price: number;
  /** start date of the phase */
  startDate: string;
  /** An optional date field. Which is requried for the protected phase */
  endDate?: string | null;
}

/**
 * Request object for create launchpad
 */
export interface CreateLaunchpadRequest {
  /** An array with a phases object */
  phases: Array<LaunchpadPhase>;

  /** The address to receive the sale proceeds when the ordinal is sold. This will be part of the sale transaction that the buyer will sign */
  sellerPaymentAddress?: string;

  /** The public key for the wallet address that owns the ordinal being listed for sale */
  sellerOrdinalPublicKey?: string;

  /** The Oridnal Address that owns the ordinal being listed for sale */
  sellerOrdinalAddress?: string;

  /** Additional information for the Launchpad. e.g {title:'someTitle', description:'SomeText'} */
  metaData: object;
  /** Wallet Provider name */
  walletProvider?: string;
}

/**
 * Response object for the create launchpad request
 */
export interface CreateLaunchpadResponse {
  /** Newly created launchpad id */
  launchpadId: string;
  /** status of the newly created launchpad. */
  status: string;
}

/**
 * Request object for get launchpad status
 */
export interface GetLaunchpadStatusRequest {
  /** Id of the launchpad to fetch the status */
  launchpadId: string;
  /** status of the launchpad */
  status: string;
}

/**
 * Response object for the get launchpad status request
 */
export interface GetLaunchpadStatusResponse {
  /** psbt of launchpad to sign transaction */
  psbt: string;
  /** status of the launchpad. */
  status: string;
}

/**
 * Request object for save launchpad
 */
export interface SaveLaunchpadRequest {
  /** Id of the launchpad to save the psbt */
  launchpadId: string;
  /** data to be update on the launchpad */
  updateLaunchData: {
    /** signed psbt by the seller to updated */
    signedListingPSBT: string;
  };
}

/**
 * Response object for the get launchpad status request
 */
export interface SaveLaunchpadResponse {
  /** success message for update confirmation */
  message: string;
}

export enum LAUNCHPAD_STATUS {
  sold = "Sold",
  pending = "Pending",
  active = "Active",
  inactive = "Inactive",
  archived = "Archived",
  pending_seller_confirmation = "Pending Seller Confirmation",
  pending_buyer_confirmation = "Pending Buyer Confirmation",
}

/**
 * Get launchpad listing request object
 */
export interface GetListingRequest {
  /**
   * Filter based on the status.
   */
  filter: { status: LAUNCHPAD_STATUS };

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
 * Get launchpad listing response object
 */
export interface GetListingResponse {
  /** Array of the launchpad listing */
  results: Array<CreateLaunchpadRequest>;
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
 * Get buyer allocation request object
 */
export interface GetAllocationRequest {
  /** launchpad id to get the buyer allocations by phase */
  launchpadId: string;
  /** buyer ordinal address for the allocation */
  buyerOrdinalAddress: string;
}

/**
 * Get buyer allocation response object
 */
export interface GetAllocationResponse {
  /** Array of the launchpad phases */
  phases: Array<AllocationPhasesResponse>;
}

/**
 * allocation phase response object
 */
export interface AllocationPhasesResponse {
  /** id of the phase */
  id: string;
  /** access type of the phase. i.e public or protected */
  public: boolean;
  /** Allocation allowed to the buyer */
  allocation?: number;
  /** total claimed inscriptions by the buyer */
  inscriptionsClaimed?: number;
}

/**
 * The fee rates for the launchpad
 */
export enum ReeRateTier {
  fastestFee,
  halfHourFee,
  hourFee,
  minimumFee,
}

/**
 * Request object for ConfirmPaddingOutputsRequest
 */
export interface ConfirmPaddingOutputsRequest {
  /** Buyer's payment wallet address. The buyer will need to pay the cost of the transaction from UTXOs belonging to this address. */
  address: string;
}

/**
 * Response object for ConfirmPaddingOutputsResponse.
 */
export interface ConfirmPaddingOutputsResponse {
  /** boolean, if padding outputs exist */
  paddingOutputsExist: boolean;
}

/**
 * Request object for SetupPaddingOutputsRequest
 */
export interface SetupPaddingOutputsRequest {
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

/**
 * Response object for SetupPaddingOutputsResponse.
 */
export interface SetupPaddingOutputsResponse {
  /** base64 transaction to be signed */
  psbt: string;

  /** Array of indices of the inputs that need to be signed by the buyer */
  buyerInputIndices: Array<number>;
}

/**
 * Response object for signTransaction.
 */
export interface SignTransactionResponse {
  /** base64 transaction to be signed */
  psbtBase64: string;

  /** transaction id of the transfer */
  txId: string;
}

/**
 * Request object for the create launchpad offer
 */
export interface CreateLaunchpadOfferRequest {
  /** launchpad id to buy the ordinal. */
  launchpadId: string;

  /** Id of the launchpad phase for ordinal to buy. */
  launchpadPhaseId?: string;

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

/**
 * Launchpad phase for create launchpad offer
 */
export interface CreateLaunchpadOfferPhase {
  /** Id of the launchpad phase*/
  _id: string;

  /** access type of the phase. i.e public or protected */
  isPublic: boolean;

  /** price per ordinal in the launchpad phases */
  price: number;

  /** Start date of the launchpad phase */
  startDate: string;

  /** end date of the launchpad phase */
  endDate: string | null;
}

/**
 * Response object of the create launchpad offer
 */
export interface CreateLaunchpadOfferResponse {
  /** launchpad phase object */
  phase: CreateLaunchpadOfferPhase;

  /** launchpad ordinal id which avaiable for the buyer */
  ordinalId: string;

  /** Launhcpad phase id whose ordinal is available to the buyer */
  launchpadPhase: string;

  /** Array of indices of the inputs that need to be signed by the buyer */
  buyerInputIndices: Array<number>;

  /** base64 transaction to be signed */
  psbt: string;
}

/**
 * Launchpad submit offer request Object
 */
export interface SubmitLaunchpadOfferRequest {
  /** Id of the ordinal to buy. */
  ordinalId: string;

  /** launchpad phase id whose ordinal is buying user */
  launchpadPhase: string;

  /** Signed psbt transaction in base64 encoding. This is the output of the creating an offer using /create-launch-offer and singing it using the buyer's payment wallet */
  signedBuyerPSBTBase64: string;
}

/**
 *
 */
export interface SubmitLaunchpadOfferResponse {
  /** transaction id for the purchase transaction */
  txId: string;
}

/**
 * Sats connect wrapper response object
 */
export interface SatsConnectWrapperResponse {
  success: boolean;
  message: string;
  psbtBase64?: string;
  txId?: string;
}

export interface InscriptionTransaction {
  /** Transaction ID of the commit transaction */
  commit: string;

  /** Transaction ID of the reveal transaction */
  reveal: string;

  /** Inscription ID */
  inscription: string;

  /** Fees paid for the inscription in satoshis */
  fees: number;

  /** Satpoint of the inscription */
  satpoint?: string;

  /** ISO timestamp of inscription */
  updatedAt?: string;
}

export interface InscriptionFile {
  /** Size of the file to be inscribed in bytes */
  size: number;

  /** File MIME type e.g. "plain/text" */
  type: string;

  /** File name e.g. "my-text-inscription-file.txt" */
  name: string;

  // only 1 of dataURL or url should be present. not both!
  /** Base64 encoded file contents */
  dataURL?: string;

  /** publicly accessible file URL */
  url?: string;

  /** Inscription transaction details */
  tx?: InscriptionTransaction;

  /*
   For some transactions this gets set to the txid 
   that inscription gets sent to user receiveAddress
  */
  sent?: string;

  // only 1 of metadataDataURL or metadataUrl should be present. not both!
  /* metadata json to be stored on chain */
  metadataDataURL?: string;
  metadataUrl?: string;

  metadataSize?: number;

  /** Metaprotocol field to be included in the inscription data */
  metaprotocol?: string;

  completed?: boolean;
  inscriptionId?: string;

  iqueued?: boolean;
  iqueuedAt?: number;
  processing?: boolean;
  status?: string;
  itemId?: string;
  error?: string;


}

export interface Delegate {
  /** valid inscription id e.g. 552448ac8b668f2b8610a4c9aa1d82dbcc3cb1b28139ad99309563aad4f1b0c1i0 */
  delegateId: string;

  /** Inscription transaction details */
  tx?: InscriptionTransaction;

  /*
   For some transactions this gets set to the txid 
   that inscription gets sent to user receiveAddress
  */
  sent?: string;

  // only 1 of metadataDataURL or metadataUrl should be present. not both!
  /* metadata json to be stored on chain */
  metadataDataURL?: string;
  metadataUrl?: string;

  metadataSize?: number;

  /** Metaprotocol field to be included in the inscription data */
  metaprotocol?: string;
}

export interface InscriptionOrderRequest {
  /*
   * An array of objects that includes:
   *
   * Mandatory
   *    - name:string; => name of the file including extension.
   *    - size:number; => size of the file in bytes
   *    - url:string; => file URL hosted on OrdinalsBot buckets
   *
   * Optional
   *    - metadataUrl:string; => metadata json file URL hosted on OrdinalsBot buckets
   *    - metadataSize:number; => size of the metadata file in bytes
   *    - metaprotocol:string; => Metaprotocol field to be included in the inscription data
   *
   * Note: you can send any dataURL text/json/image/video data in a parameter called dataURL instead of url for files
   */
  files?: InscriptionFile[];

  /** files OR delegates array is mandatory for an order */
  delegates?: Delegate[];

  /**
   * Miner fee that will be paid while inscribing the ordinals in sats/byte.
   * (default=2 sats/byte)
   */
  fee?: number;

  /**
   * Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
   * (default=false)
   */
  lowPostage?: boolean;

  /**
   * A single Bitcoin address to receive the inscriptions for the whole order
   * Or one receiver Address per file
   */
  receiveAddress?: string | string[];

  /**
   * Inscribe on a rare, exotic, early sat.
   * Options: vintage | block78 | pizza | uncommon | random (default=random)
   * full list can be queried from inventory endpoint
   */
  rareSats?: string;

  /**
   * Referral code to earn up to %15 of the order service fee.
   */
  referral?: string;

  /**
   * Amount of satoshis to charge extra for this order that will be added to "referral" account.
   * Needs to be used together with "referral" parameter.
   */
  additionalFee?: number;

  /* Order timeout in minutes. 
    Generated payment invoice will be valid for this duration only. Payments that are sent after this will not be processed.
    default=4320 (3 days)
  */
  timeout?: number;

  /** URL to receive a POST request when each file in the order is inscribed */
  webhookUrl?: string;

  /**
   * Use brotli compression to reduce file sizes on chain
   * default=false
   */
  compress?: boolean;

  /**
   *
   */
  parent?: InscriptionOrderParentRequest;

  /**
   *
   */
  projectTag?: string;

  batchMode?: BatchModeType;
}

export interface DirectInscriptionOrderRequest {
  /*
   * An array of objects that includes:
   *
   * Mandatory
   *    - name:string; => name of the file including extension.
   *    - size:number; => size of the file in bytes
   *    - url:string; => file URL hosted on OrdinalsBot buckets
   *
   * Optional
   *    - metadataUrl:string; => metadata json file URL hosted on OrdinalsBot buckets
   *    - metadataSize:number; => size of the metadata file in bytes
   *    - metaprotocol:string; => Metaprotocol field to be included in the inscription data
   *
   * Note: you can send any dataURL text/json/image/video data in a parameter called dataURL instead of url for files
   */
  files?: InscriptionFile[];

  /**
   * Miner fee that will be paid while inscribing the ordinals in sats/byte.
   * (default=2 sats/byte)
   */
  fee?: number;

  /**
   * Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
   * (default=false)
   */
  lowPostage?: boolean;

  /**
   * A single Bitcoin address to receive the inscriptions for the whole order
   * Or one receiver Address per file
   */
  receiveAddress?: string | string[];

  /**
   * Limit which sats can be used to inscribe onto this order.
   * i.e. ['vintage', 'block78', 'pizza', 'uncommon']
   * full list of supported satributes can be queried from satscanner endpoint
   */
  allowedSatributes?: string[];

  /**
   * Referral code to earn up to %15 of the order service fee.
   */
  referral?: string;

  /**
   * Amount of satoshis to charge extra for this order that will be added to "referral" account.
   * Needs to be used together with "referral" parameter.
   */
  additionalFee?: number;

  /** URL to receive a POST request when each file in the order is inscribed */
  webhookUrl?: string;
}

export interface DirectInscriptionOrder extends DirectInscriptionOrderRequest {
  id: string;
  status: string;
  // ... input parameters from DirectInscriptionOrderRequest
  charge: DirectInscriptionCharge;
  chainFee: number; // in satoshis
  serviceFee: number; // in satoshis
  baseFee: number;
  postage: number;
  orderType: OrderType;
  state: InscriptionOrderState;
  createdAt: number; // timestamp in ms,
  paid?: boolean;
}

/**
 * Parent Reqeust object for the Inscription order
 */
export interface InscriptionOrderParentRequest {
  inscriptionId: string;
  returnAddress: string;
  depositAddress: string;
  parentReturnTx: string;
}

export interface InscriptionCharge {
  id: string;
  description: string;
  amount: number;
  missing_amt: number;
  status: string;
  fiat_value: number;
  source_fiat_value: number;
  currency: string;
  created_at: number;
  order_id: string;
  address: string;
  metadata?: InscriptionChargeMetadata;
  expires_at?: string;
  auto_settle?: boolean;
  chain_invoice?: InscriptionOnchainInvoice;
  lightning_invoice?: InscriptionLightningInvoice;
  transactions?: InscriptionChargeTransaction[];
  uri?: string;
  callback_url?: string;
  hosted_checkout_url?: string;
}

export interface DirectInscriptionCharge {
  amount: number;
  address: string;
}

export interface InscriptionOrder extends InscriptionOrderRequest {
  id: string;
  status: string;
  // ... input parameters from InscriptionOrderRequest
  charge: InscriptionCharge;
  chainFee: number; // in satoshis
  serviceFee: number; // in satoshis
  baseFee: number;
  rareSatsFee: number;
  postage: number;
  orderType: string;
  zeroConf: string | null;
  state: InscriptionOrderState;
  createdAt: number; // timestamp in ms,


  tx?: string;
  error?: string;
  refund?: string;
  underpaid?: boolean;
  overpaid?: boolean;
  launchpadId?: string;
  sent?: string;
  expired?: boolean;
  amount?: number;

  inscribedCount?: number;


  paid?: boolean;
}

export interface InscriptionOnchainInvoice {
  address: string;
  settled_at: number;
  tx: string;
}

export interface InscriptionLightningInvoice {
  expires_at: number,
  payreq: string,
}
export interface InscriptionChargeTransaction {
  address: string;
  created_at: number;
  settled_at: number;
  tx: string;
  status: string;
  amount: number;
}

export interface InscriptionChargeMetadata {
  email: string;
  invoice_id: string;
}

/**
 * Represents a request for pricing information for inscribing files.
 */
export interface InscriptionPriceRequest {
  /** Total size of all files to be inscribed in bytes */
  size: number;

  /** Miner fee that will be paid while inscribing the ordinal in sats/byte. (default=2 sats/byte) */
  fee: number;

  /** Number of files to be inscribed (default=1) */
  count: number;

  /** Inscribe on a rare, exotic, early sat. 
    Options: vintage | block78 | pizza | uncommon | random (default=random) 
    full list can be queried from inventory endpoint
  */
  rareSats: string;

  /** Esitmate fees for the files with minimum postage
   * (padding) 546 sats instead of the standard 10,000 sats
   * (default = false)
   */
  lowPostage?: boolean;

  /**
   * Type of inscription order that is being requested.
   * (default = managed)
   */
  type?: OrderType;

  /**
   * Type of batch mode that is being requested.
   * (optional)
   */
  batchMode?: BatchModeType;

  /**
   * Additional fee(in satoshis) to be added to order total and passed to your referral code.
   */
  additionalFee?: number;

  /**
   * The custom base fee from apikey
   */
  baseFee?: number;
}

/**
 * Represents a response for pricing information for inscribing files.
 */
export interface InscriptionPriceResponse {
  chainFee: number; // chain fee that will be paid to miners
  baseFee: number; // base service fee taken by inscription.com
  serviceFee: number; // total service fee taken by inscription.com
  rareSatsFee: number;
  additionalFee: number; //the additinal fee per file
  postage: number; //postage fee according to provided lowPostage. i.e lowPostage is 546 and normalPostage is 10,000
  amount: number; // amount to be paid by the user
  totalFee: number; // total amount to be paid by the user
}

export interface InscriptionCollectionCreateRequest {
  /**
   * An array of objects that includes:
   *  - name:string; => name of the file including extension.
   *  - size:number; => size of the file in bytes.
   *  - url:string; => publicly accessible image URL
   */
  files: InscriptionFile[];

  /** URL safe unique collection slug. Will be used as mint URL. */
  id?: string;

  /** Collection Display Name */
  name?: string;

  /** Collection description */
  description?: string;

  /** Collection creator */
  creator: string;

  /** Inscription price per file (for collection creator) set to 0 for free mints */
  price: number;

  /** Max supply of the collection */
  totalCount?: number;

  /** Collection twitter account */
  twitter?: string;

  /** Collection website */
  website?: string;

  /** Collection banner image URL */
  banner?: string;

  /** Collection cover image URL */
  cover?: string;

  /** Miner fee that will be paid while inscribing the ordinals in sats/byte. (default=2 sats/byte) */
  fee?: number;

  /** Inscription service fee per file taken by ordinalsbot.com, min: 27000 (sats)  */
  serviceFee?: number;

  /** Bitcoin address to receive payouts from inscriptions */
  "creator-address": string;

  // allowlist is optional
  allowList?: AllocationMap;
  discord?: string;
  parent?: InscriptionOrderParentRequest;
  /** brc20 collection fields */
  deployInscription?: string;
  saleSize?: number;
}

// allocation: -1 = unlimited, 0 = not allowed, any other number = allowed number of inscriptions
export type AllocationMap = {
  [address: string]: {
    allocation: number;
  };
};

export interface InscriptionCollectionCreateResponse
  extends InscriptionCollectionCreateRequest {
  averageSize: number;
  inscribedCount: number;
  status: string;
  active: boolean;
  // ... input parameters from InscriptionCollectionCreateRequest
  createdAt: number;
}

export interface InscriptionCollection {
  /** unique ID of the collection being requested */
  id: string;

  /** number of items requested from collection */
  count: number;

  requestedIds?: number[];
}

export interface InscriptionCollectionOrderRequest {
  /** Mining fee to be paid for this collection inscription (sats/vB) */
  fee?: number;

  /** Bitcoin address to receive the inscriptions for the whole order */
  receiveAddress?: string;

  /**
   * Object including
   * id: Collection slug to be inscribed
   * count: number of inscriptions being ordered.
   * requestedIds: id to be requested. one from both count or requestedIds is must
   */
  collection?: InscriptionCollection;

  referral?: string;

  /** Cloudflare turnstile token. Required if no x-api-key header is present. */
  token?: string;

  /**
   * Inscribe on a rare, exotic, early sat.
   * Options: vintage | block78 | pizza | uncommon | random (default=random)
   * full list can be queried from inventory endpoint
   */
  rareSats?: string;

  /**
   * Order timeout in minutes.
   * Generated payment invoice will be valid for this duration only. Payments that are sent after this will not be processed.
   * (default=4320)
   */
  timeout?: number;

  /**
   * Amount of satoshis to charge extra for this order that will be added to "referral" account.
   * Needs to be used together with "referral" parameter.
   */
  additionalFee?: number;
}

/**
 * Create collectionorder response Object
 */
export interface InscriptionCollectionOrderResponse {
  charge: InscriptionCharge;
  collection: InscriptionCollection;
  fee: number;
  rareSatsFee: number;
  serviceFee: number; // in satoshis
  price: number;
  fileCount: number;
  orderType: string;
  postage: number;
  lowPostage: number;
  chainFee: number; // in satoshis
  amount: number; // in satoshis
  id: string;
  additionalFee: number;
  rareSats: string;
  receiveAddress: string;
  referral: string;
  zeroConf: string;
  status: string;
  state: InscriptionOrderState;
  createdAt: number; // timestamp in ms,
}

/**
 * Create textorder request object
 * Does not use files, but instead uses an array of strings to be inscribed.
 */
export interface InscriptionTextOrderRequest {
  /**
   * An array of strings to be inscribed
   */
  texts: string[];

  /**
   * Miner fee that will be paid while inscribing the ordinals in sats/byte.
   * (default=2 sats/byte)
   */
  fee?: number;

  /**
   * Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
   * (default=false)
   */
  lowPostage?: boolean;

  /**
   * A single Bitcoin address to receive the inscriptions for the whole order
   * Or one receiver Address per file
   */
  receiveAddress?: string | string[];

  /**
   * Inscribe on a rare, exotic, early sat.
   * Options: vintage | block78 | pizza | uncommon | random (default=random)
   * full list can be queried from inventory endpoint
   */
  rareSats?: string;

  /**
   * Referral code to earn up to %15 of the order service fee.
   */
  referral?: string;

  /**
   * Amount of satoshis to charge extra for this order that will be added to "referral" account.
   * Needs to be used together with "referral" parameter.
   */
  additionalFee?: number;

  /* Order timeout in minutes. 
    Generated payment invoice will be valid for this duration only. Payments that are sent after this will not be processed.
    default=4320 (3 days)
  */
  timeout?: number;

  /** URL to receive a POST request when each file in the order is inscribed */
  webhookUrl?: string;

  /**
   * Use brotli compression to reduce file sizes on chain
   * default=false
   */
  compress?: boolean;

  /**
   *
   */
  parent?: InscriptionOrderParentRequest;

  /**
   *
   */
  projectTag?: string;

  batchMode?: BatchModeType;

}

type InscriptionInventoryData = {
  // amount of sats available in this inventory
  amount: number;
  // base fee for each inscription for this type of special sat
  baseFee: number;

  // number of possible concurrent inscriptions available for this type of special sat
  count: number;

  // maximum size of a single inscription for this type of special sat
  maxSize: number;

  // minimum size of a single inscription for this type of special sat
  minSize: number;
};

type InscriptionInventoryItem = {
  [specialSatType: string]: InscriptionInventoryData;
};

export interface InscriptionInventoryResponse {
  [specialSatType: string]: InscriptionInventoryItem;
}

export interface InscriptionReferralRequest {
  referral: string;
  address: string;
}

export interface InscriptionPayout {
  id: string;
  count: number;
  custom_id: string;
  paidAmount: number;
  email: string;
  address: string;
  amount: string;
  fee: string;
  tx: string;
  status: string;
  created_at: number;
  processed_at: string;
  checkout_id: string;
}

export interface InscriptionReferralStatusResponse {
  address: string;
  orderCound: number;
  paidCount: number;
  payments?: InscriptionPayout[];
  orders?: { [orderId: string]: true }[];
}

export interface InscriptionReferralSetResponse {
  status: string;
}

/**
 * Response object for create special Sats.
 */
export interface CreateSpecialSatsResponse {
  /**
   * base64 transaction to be signed
   */
  psbt: string;
}

/**
 * Request object for Create Special Sats.
 */
export interface CreateSpecialSatsRequest {
  /** Charge amount for creating Create Special Sats */
  chargeAmount: string;

  /** The funding payment address */
  fundingAddress: string;

  /** The Special Sats Output public key */
  specialSatsOutput: string;

  /** user's payment address */
  userAddress: string;

  /** user's payment public key*/
  userPublicKey: string;

  /**feeRate */
  feeRate: number;
}

// Order states enum
export enum InscriptionOrderState {
  WAITING_PAYMENT = 'waiting-payment', // order is waiting for a payment to be detected
  WAITING_CONFIRMATION = 'waiting-confirmation', // payment is detected, waiting for confirmations
  WAITING_PARENT = 'waiting-parent', // order is waiting for the parent inscription to hit the wallet
  PREP = 'prep', // order files are being downloaded
  QUEUED = 'queued', // order is queued for inscription
  ERROR = 'error', // order has an error
  CANCELED = 'cancelled', // order is cancelled
  WAITING_REFUND = 'waiting-refund', // collection order is waiting refund
  REFUNDED = 'refunded', // collection order was refunded
  EXPIRED = 'expired', // payment processor invoice expired
  COMPLETED = 'completed', // order is completed, files are inscribed
}

export enum OrderType {
  RUNE_ETCH = 'rune-etch',
  RUNE_MINT = 'rune-mint',
  RUNE_LAUNCHPAD_MINT = 'rune-launchpad-mint',
  BULK = 'bulk',
  DIRECT = 'direct',
  BRC20 = 'brc20'
}

export enum BatchModeType {
  SEPARATE_OUTPUTS = 'separate-outputs',
  SHARED_OUTPUT = 'shared-output'
}
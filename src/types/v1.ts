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
}

export interface InscriptionOrderRequest {
  files: InscriptionFile[];
  fee: number;

  /** Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
    (default=false) 
  */
  lowPostage?: boolean;
  receiveAddress?: string;

  /** Inscribe on a rare, exotic, early sat. 
   Options: vintage | block78 | pizza | uncommon | random (default=random) 
    full list can be queried from inventory endpoint
  */
  rareSats?: string;

  /** referral code to earn up to %15 of the order service fee. */
  referral?: string;

  /** Amount of satoshis to charge extra for this order that will be added to "referral" account.
    Needs to be used together with "referral" 
  */
  additionalFee?: number;

  /* Order timeout in minutes. 
    Generated payment invoice will be valid for this duration only. Payments that are sent after this will not be processed.
    default=4320 (3 days)
  */
  timeout?: number;

  /** URL to receive a POST request when each file in the order is inscribed */
  webhookUrl?: string;

  /** Use brotli compression to reduce file sizes on chain
   * default=false
   */
  compress?: boolean;
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
  transactions?: InscriptionChargeTransaction[];
}

export interface InscriptionOrder extends InscriptionOrderRequest {
  status: string;
  // ... input parameters from InscriptionOrderRequest
  charge: InscriptionCharge;
  chainFee: number; // in satoshis
  serviceFee: number; // in satoshis
  orderType: string;
  createdAt: number; // timestamp in ms,
}

export interface InscriptionOnchainInvoice {
  address: string;
  settled_at: number;
  tx: string;
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
}

export interface InscriptionPriceResponse {
  status: string;
  chainFee: number; // chain fee that will be paid to miners
  baseFee: number; // base service fee taken by inscription.com
  serviceFee: number; // total service fee taken by inscription.com
  totalFee: number; // total amount to be paid by the user
}

export interface InscriptionCollectionCreateRequest {
  /** URL safe unique collection slug. This will be used as part of mint URL. */
  id: string;
  files: InscriptionFile[];

  // Inscription price per file (for collection creator) set to 0 for free mints
  price: number;
  // Max supply of the collection.
  totalCount: number;

  // Miner fee that will be paid while inscribing the ordinals in sats/byte. (default=2 sats/byte)
  fee?: number;

  // Inscription service fee per file taken by inscription.com, min: 27000 (sats)
  serviceFee?: number;
  // Bitcoin address to receive payouts from inscriptions
  "creator-address": string;

  // collection metadata
  name: string;
  description: string;
  creator: string;
  // optional info to be displayed on the mint page
  twitter?: string;
  website?: string;
  discord?: string;

  // images to be used on the mint page
  banner?: string;
  cover?: string;
}

export interface InscriptionCollectionCreateResponse
  extends InscriptionCollectionCreateRequest {
  status: string;
  // ... input parameters from InscriptionCollectionCreateRequest
  createdAt: number;
}

export interface InscriptionCollection {
  /** unique ID of the collection being requested */
  id: string;

  /** number of items requested from collection */
  count: number;
}

export interface InscriptionCollectionOrderRequest {
  collection: InscriptionCollection;

  // cloudflare turnstile token
  token?: string;

  receiveAddress?: string;

  /** Inscribe on a rare, exotic, early sat. 
   Options: vintage | block78 | pizza | uncommon | random (default=random) 
    full list can be queried from inventory endpoint
  */
  rareSats?: string;
}

export interface InscriptionTextOrderRequest {
  texts: string[];
  fee: number;

  /** Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
    (default=false) 
  */
  lowPostage?: boolean;
  receiveAddress?: string;

  /** referral code to earn up to %15 of the order service fee. */
  referral?: string;
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

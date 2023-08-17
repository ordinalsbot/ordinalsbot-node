export interface OrdinalsBotFile {
  /** Size of the file to be inscribed in bytes */
  size: number;

  /** File MIME type e.g. "plain/text" */
  type: string;

  /** File name e.g. "my-text-inscription-file.txt" */
  name: string;

  /** Base64 encoded file contents */
  dataURL?: string;

  /** publicly accessible file URL */
  url?: string;
};

export interface OrdinalsBotOrderRequest {
  files: OrdinalsBotFile[],
  fee: number;

  /** Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
    (default=false) 
  */
  lowPostage?: boolean,
  receiveAddress?: string,

  /** Inscribe on a rare, exotic, early sat. 
   Options: vintage | block78 | pizza | uncommon | random (default=random) 
    full list can be queried from inventory endpoint
  */
  rareSats?: string,

  /** referral code to earn up to %15 of the order service fee. */
  referral?: string,

  /** Amount of satoshis to charge extra for this order that will be added to "referral" account.
    Needs to be used together with "referral" 
  */
  additionalFee?: number,

  /** URL to receive a POST request when each file in the order is inscribed */
  webhookUrl?: string,
}

export interface OrdinalsBotCharge {
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
  metadata?: OrdinalsBotChargeMetadata;
  expires_at?: string;
  auto_settle?: boolean;
  chain_invoice?: OrdinalsBotOnchainInvoice;
  transactions?: OrdinalsBotChargeTransaction[];
}

export interface OrdinalsBotOrder extends OrdinalsBotOrderRequest {
  status: string;
  // ... input parameters from OrdinalsBotOrderRequest
  charge: OrdinalsBotCharge;
  chainFee: number; // in satoshis
  serviceFee: number; // in satoshis
  orderType: string;
  createdAt: number; // timestamp in ms,
}

export interface OrdinalsBotOnchainInvoice {
  address: string;
  settled_at: number;
  tx: string;
}

export interface OrdinalsBotChargeTransaction {
  address: string;
  created_at: number;
  settled_at: number;
  tx: string;
  status: string;
  amount: number;
}

export interface OrdinalsBotChargeMetadata {
  email: string;
  invoice_id: string;
}

export interface OrdinalsBotPriceRequest {
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

export interface OrdinalsBotPriceResponse {
  "status": string,
  "chainFee": number, // chain fee that will be paid to miners
  "baseFee": number, // base service fee taken by ordinalsbot.com
  "serviceFee": number, // total service fee taken by ordinalsbot.com
  "totalFee": number // total amount to be paid by the user
}

export interface OrdinalsBotCollectionCreateRequest {
  /** URL safe unique collection slug. This will be used as part of mint URL. */
  id: string;
  files: OrdinalsBotFile[],

  // Inscription price per file (for collection creator) set to 0 for free mints
  price: number;
  // Max supply of the collection.
  totalCount: number;

  // Miner fee that will be paid while inscribing the ordinals in sats/byte. (default=2 sats/byte)
  fee?: number;

  // Inscription service fee per file taken by ordinalsbot.com, min: 27000 (sats)
  serviceFee?: number;
  // Bitcoin address to receive payouts from inscriptions
  "creator-address": string,

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

export interface OrdinalsBotCollectionCreateResponse extends OrdinalsBotCollectionCreateRequest {
  status: string;
  // ... input parameters from OrdinalsBotCollectionCreateRequest
  createdAt: number;
}

export interface OrdinalsBotCollection {
  /** unique ID of the collection being requested */
  id: string;

  /** number of items requested from collection */
  count: number;
}

export interface OrdinalsBotCollectionOrderRequest {
  collection: OrdinalsBotCollection,

  // cloudflare turnstile token
  token?: string,

  receiveAddress?: string,

  /** Inscribe on a rare, exotic, early sat. 
   Options: vintage | block78 | pizza | uncommon | random (default=random) 
    full list can be queried from inventory endpoint
  */
  rareSats?: string,
}

export interface OrdinalsBotTextOrderRequest {
  texts: string[],
  fee: number;

  /** Inscribe file with minimum postage (padding) 546 sats instead of the standard 10,000 sats.
    (default=false) 
  */
  lowPostage?: boolean,
  receiveAddress?: string,

  /** referral code to earn up to %15 of the order service fee. */
  referral?: string,
}

type OrdinalsBotInventoryData = {
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
}

type OrdinalsBotInventoryItem = {
  [specialSatType: string]: OrdinalsBotInventoryData;
}

export interface OrdinalsBotInventoryResponse {
  [specialSatType: string]: OrdinalsBotInventoryItem;
}

export interface OrdinalsBotReferralRequest {
  referral: string;
  address: string;
}

export interface OrdinalsBotPayout {
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

export interface OrdinalsBotReferralStatusResponse {
  address: string;
  orderCound: number;
  paidCount: number;
  payments?: OrdinalsBotPayout[];
  orders?: {[orderId: string]: true}[];
}

export interface OrdinalsBotReferralSetResponse {
  status: string;
}
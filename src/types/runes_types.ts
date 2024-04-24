import { InscriptionCharge, InscriptionFile, InscriptionOrderState, OrderType } from "./v1";

export interface RunesEtchOrderRequest {
  rune: string;

  supply: number;

  symbol: string;

  divisibility: number;

  fee: number;

  receiveAddress: string;

  terms?: RuneTerms;

  turbo: boolean;

  premine?: number;

  additionalFee?: number;

  referral?: string;
}

export interface RuneTerms {
  offset?: RuneTermsOffset;
  height?: RuneTermsHeight;
  cap?: number;
  amount?: number;
}

export interface RuneTermsOffset {
  start: number;
  end: number;
}

export interface RuneTermsHeight {
  start: number;
  end: number;
}

export interface RunesEtchOrderResponse {
  runeProperties: RuneProperties;
  fee: number;
  files: InscriptionFile[];
  charge: InscriptionCharge;
  chainFee: number;
  serviceFee: number;
  receiveAddress: string;
  baseFee: number;
  rareSatsFee: number;
  postage: number;
  lowPostage: boolean
  id: string;
  orderType: OrderType;
  state: InscriptionOrderState;
  createdAt: string;
  referral?: string;
  additionalFee?: number;
}

export interface RuneProperties {
  turbo: boolean;
  rune: string;
  supply: number;
  symbol: string;
  divisibility: number;
  premine: number;
  cap: number;
  amount: number;
  offset: RuneTermsOffset;
  height: RuneTermsHeight;
};

export interface RunesMintOrderRequest {
  rune: string;
  receiveAddress: string;
  numberOfMints: number;
  fee: number;
  additionalFee?: number;
  referral?: string;
}

export interface RunesMintOrderResponse {
  charge: InscriptionCharge;
  rune: string;
  receiveAddress: string;
  fee: number;
  chainFee: number;
  serviceFee: number;
  baseFee: number;
  rareSatsFee: number;
  postage: number;
  numberOfMints: number;
  id: string;
  orderType: OrderType;
  state: InscriptionOrderState;
  createdAt: string;
  executedMints: number;
  mintingTxs: string[];
  additionalFee?: number;
  referral?: string;
}
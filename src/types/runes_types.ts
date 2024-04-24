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
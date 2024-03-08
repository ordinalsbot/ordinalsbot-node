import { SpecialRange } from "./satscanner_types";

export interface SatextractorExtractRequest {
  // address to scan for special sats
  scanAddress: string;

  // address to send special sats after extraction (i.e. ordinals address)
  addressToSendSpecialSats: string;

  // address to send common sats after extraction (i.e. payment address)
  addressToSendCommonSats: string;

  // fee per byte in satoshis to use for extraction transaction
  feePerByte: number;

  // Array of strings, if supplied we will only detect the selected satributes; Everything else will be sent to the common sats address.
  filterSatributes: string[];
}

export interface SatextractorExtractResponse {
  specialRanges: SpecialRange[];

  // unsigned transaction to be signed by the scanAddress wallet
  tx: string;
}
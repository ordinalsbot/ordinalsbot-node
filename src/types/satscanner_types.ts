export interface SatscannerSpecialRangesUtxoRequest {
  utxos: string[];
}

export interface SatscannerSpecialRangesRequest {
  address: string;
}

export interface SatscannerSpecialRangesResponse {
  inscriptions: InscriptionEntry[];
  ranges: Range[];
  specialRanges: SpecialRange[];
}

export interface InscriptionEntry {
  output: string;
  inscriptions: string[];
}

export interface Range {
  start: number;
  end: number;
}

export interface SpecialRange {
  start: number;
  end: number;
  type: string;
}

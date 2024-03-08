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
  output: string;
  start: number;
  end: number;
  size: number;
  offset: number;
  rarity: string;
}

export interface SpecialRange {
  start: number;
  output: string;
  size: number;
  offset: number;
  satributes: string[];
}

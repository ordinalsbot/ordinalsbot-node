import { SatscannerClient } from "./satscannerClient";
import { InscriptionEnv } from "./types";
import { 
  SatscannerSpecialRangesRequest, 
  SatscannerSpecialRangesResponse,
  SatscannerSpecialRangesUtxoRequest
} from "./types/satscanner_types";

export class Satscanner {
  private satscannerInstance!: SatscannerClient;

  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.satscannerInstance !== undefined) {
      console.error("satscanner.setCredentials was called multiple times");
      return;
    }
    this.satscannerInstance = new SatscannerClient(key, environment);
  }

  getSupportedSatributes(): Promise<string[]> {
    return this.satscannerInstance.getSupportedSatributes();
  }

  findSpecialRanges(
    specialRangesRequest: SatscannerSpecialRangesRequest
  ): Promise<SatscannerSpecialRangesResponse> {
    return this.satscannerInstance.findSpecialRanges(specialRangesRequest);
  }

  findSpecialRangesUtxo(
    specialRangesRequestUtxo: SatscannerSpecialRangesUtxoRequest
  ): Promise<SatscannerSpecialRangesResponse> {
    return this.satscannerInstance.findSpecialRangesUtxo(specialRangesRequestUtxo);
  }
}

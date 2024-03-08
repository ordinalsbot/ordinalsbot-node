import { SatextractorClient } from "./satextractorClient";
import { InscriptionEnv } from "./types";
import { 
  SatextractorExtractRequest,
  SatextractorExtractResponse,
} from "./types/satextractor_types";

export class Satextractor {
  private satextractorInstance!: SatextractorClient;

  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.satextractorInstance !== undefined) {
      console.error("satextractor.setCredentials was called multiple times");
      return;
    }
    this.satextractorInstance = new SatextractorClient(key, environment);
  }

  extract(
    extractRequest: SatextractorExtractRequest
  ): Promise<SatextractorExtractResponse> {
    return this.satextractorInstance.extract(extractRequest);
  }
}

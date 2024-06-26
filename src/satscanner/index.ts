import { SatscannerClient } from "./client";
import { ClientOptions, InscriptionEnv, InscriptionEnvNetwork } from "../types";
import {
  SatscannerSpecialRangesRequest,
  SatscannerSpecialRangesResponse,
  SatscannerSpecialRangesUtxoRequest,
} from "../types/satscanner_types";

/**
 * A higher-level interface for interacting with the Satscanner API.
 */
export class Satscanner {
  /**
   * The underlying SatscannerClient instance.
   */
  private satscannerInstance!: SatscannerClient;

  /**
   * Creates a new Satscanner instance.
   * @param {string} [key=''] - The API key for authentication.
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
   */
  constructor(key: string = "", environment: InscriptionEnv = InscriptionEnvNetwork.mainnet, options?: ClientOptions) {
    if (this.satscannerInstance !== undefined) {
      console.error("satscanner.setCredentials was called multiple times");
      return;
    }
    environment = InscriptionEnvNetwork[environment]??InscriptionEnvNetwork.mainnet;
    this.satscannerInstance = new SatscannerClient(key, environment, options);
  }

  /**
   * Retrieves the supported Satributes.
   * @returns {Promise<string[]>} A promise that resolves to an array of supported Satributes.
   */
  getSupportedSatributes(): Promise<string[]> {
    return this.satscannerInstance.getSupportedSatributes();
  }

  /**
   * Finds special ranges using the Satscanner API.
   * @param {SatscannerSpecialRangesRequest} specialRangesRequest - The request object for finding special ranges.
   * @returns {Promise<SatscannerSpecialRangesResponse>} A promise that resolves to the special ranges response.
   */
  findSpecialRanges(
    specialRangesRequest: SatscannerSpecialRangesRequest
  ): Promise<SatscannerSpecialRangesResponse> {
    return this.satscannerInstance.findSpecialRanges(specialRangesRequest);
  }

  /**
   * Finds special ranges UTXO using the Satscanner API.
   * @param {SatscannerSpecialRangesUtxoRequest} specialRangesRequestUtxo - The request object for finding special ranges UTXO.
   * @returns {Promise<SatscannerSpecialRangesResponse>} A promise that resolves to the special ranges UTXO response.
   */
  findSpecialRangesUtxo(
    specialRangesRequestUtxo: SatscannerSpecialRangesUtxoRequest
  ): Promise<SatscannerSpecialRangesResponse> {
    return this.satscannerInstance.findSpecialRangesUtxo(
      specialRangesRequestUtxo
    );
  }
}

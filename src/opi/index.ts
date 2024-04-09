import { OpiClient } from "./client";
import { InscriptionEnv } from "../types/index";

/**
 * A interface for interacting with the Opi API.
 */
export class Opi {
  /**
   * The underlying OpiClient instance.
   */
  private opiInstance!: OpiClient;

  /**
   * Creates a new Opi instance.
   * @param {string} [key=''] - The API key for authentication.
   * @param {InscriptionEnv} [environment='live'] - The environment (live or dev) for the Opi.
   */
  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.opiInstance !== undefined) {
      console.error("opi.setCredentials was called multiple times");
      return;
    }
    this.opiInstance = new OpiClient(key, environment);
  }

  /**
   * Extracts block height.
   * @returns {Promise<number>} A promise that resolves to the extraction response.
   */
  async blockHeight(): Promise<number> {
    return this.opiInstance.blockHeight();
  }
}

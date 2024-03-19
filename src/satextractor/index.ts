import { SatextractorClient } from './client'
import { InscriptionEnv } from '../types/index'
import {
  SatextractorExtractRequest,
  SatextractorExtractResponse,
} from '../types/satextractor_types'

/**
 * A interface for interacting with the Satextractor API.
 */
export class Satextractor {
  /**
   * The underlying SatextractorClient instance.
   */
  private satextractorInstance!: SatextractorClient

  /**
   * Creates a new Satextractor instance.
   * @param {string} [key=''] - The API key for authentication.
   * @param {InscriptionEnv} [environment='live'] - The environment (live or dev) for the Satextractor.
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    if (this.satextractorInstance !== undefined) {
      console.error('satextractor.setCredentials was called multiple times')
      return
    }
    this.satextractorInstance = new SatextractorClient(key, environment)
  }

  /**
   * Extracts data using the Satextractor API.
   * @param {SatextractorExtractRequest} extractRequest - The request object for data extraction.
   * @returns {Promise<SatextractorExtractResponse>} A promise that resolves to the extraction response.
   */
  extract(
    extractRequest: SatextractorExtractRequest
  ): Promise<SatextractorExtractResponse> {
    return this.satextractorInstance.extract(extractRequest)
  }
}

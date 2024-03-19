import { Inscription } from './inscription/index'
import { Launchpad } from './launchpad/index'
import { MarketPlace } from './marketplace'
import { InscriptionEnv } from './types'

export { InscriptionClient } from './client'
export { InscriptionError } from './inscription/error'
export * from './types'
export { MarketPlace } from './marketplace'
export { Inscription } from './inscription/index'

/**
 * Represents a bot for managing marketplaces and inscriptions.
 */
export class Ordinalsbot {
  /**
   * The marketplace instance.
   */
  MarketPlace!: MarketPlace

  /**
   * The inscription instance.
   */
  Inscription!: Inscription

  /**
   * The launchpad instance.
   */
  Launchpad!: Launchpad

  /**
   * Creates an instance of Ordinalsbot.
   * @param {string} key - The API key for authentication.
   * @param {InscriptionEnv} environment - The environment (e.g., "live" or "dev") for the inscription.
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    
    /**
     * initialising the marketplace instance
     */
    if (this.MarketPlace === undefined) {
      this.MarketPlace = new MarketPlace(key, environment)
    }

    /**
     * initialising the inscription instance
     */
    if (this.Inscription === undefined) {
      this.Inscription = new Inscription(key, environment)
    }

    /**
     * initialising the launchpad instance
     */
    if (this.Launchpad === undefined) {
      this.Launchpad = new Launchpad(key, environment)
    }
  }
}

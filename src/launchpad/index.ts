import { BitcoinNetworkType } from 'sats-connect'
import { LaunchpadClient } from './client'
import { InscriptionEnv } from '../types'
import {
  LaunchpadMarketplaceCreateRequest,
  LaunchpadMarketplaceCreateResponse,
} from '../types/launchpad_types'

/**
 * A class for interacting with the Launchpad API to create marketplaces.
 */
export class Launchpad {
  /**
   * The Bitcoin network type to use ('Mainnet' or 'Testnet').
   */
  private network: BitcoinNetworkType
  /**
   * The instance of LaunchpadClient used to make API requests.
   */
  private launchpadClientInstance!: LaunchpadClient

  /**
   * Creates an instance of Launchpad.
   * @param {string} key - The API key for authentication.
   * @param {InscriptionEnv} environment - The environment for the API (e.g., 'live', 'dev').
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    if (this.launchpadClientInstance !== undefined) {
      console.error('marketplace constructore was called multiple times')
      return
    }

    this.network =
      environment === 'live'
        ? BitcoinNetworkType.Mainnet
        : BitcoinNetworkType.Testnet

    this.launchpadClientInstance = new LaunchpadClient(key, environment)
  }

  /**
   * Creates a new marketplace using the Launchpad API.
   * @param {LaunchpadMarketplaceCreateRequest} createMarketplaceRequest The request body for creating a new marketplace.
   * @returns {Promise<LaunchpadMarketplaceCreateResponse>} A promise that resolves to the response from the API.
   */
  createMarketplace(
    createMarketplaceRequest: LaunchpadMarketplaceCreateRequest
  ): Promise<LaunchpadMarketplaceCreateResponse> {
    return this.launchpadClientInstance.createMarketPlace(
      createMarketplaceRequest
    )
  }
}

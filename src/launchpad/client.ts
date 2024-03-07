import axios, { AxiosInstance } from 'axios'
import { InscriptionEnv } from '../types'
import { InscriptionError } from '../InscriptionError'
import {
  LaunchpadMarketplaceCreateRequest,
  LaunchpadMarketplaceCreateResponse,
} from '../types/launchpad_types'

/**
 * A client for interacting with the Launchpad marketplace API.
 */
export class LaunchpadClient {
  /**
   * The environment for the API (e.g., 'live', 'dev').
   */
  public env: InscriptionEnv

  /**
   * The API key used for authentication.
   */
  private api_key: string

  /**
   * The Axios instance for making API requests.
   */
  private instanceV1: AxiosInstance

  /**
   * Creates an instance of LaunchpadClient.
   * @param {string} key - The API key for authentication.
   * @param {InscriptionEnv} environment - The environment for the API (e.g., 'live', 'dev').
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    this.api_key = key
    this.env = environment

    const createInstance = (): AxiosInstance => {
      const headers: Record<string, string> = {
        Connection: 'Keep-Alive',
        'Content-Type': 'application/json',
      }

      // Add the API key header only if this.api_key has a value
      if (this.api_key) {
        headers['x-api-key'] = this.api_key
      }

      const client = axios.create({
        baseURL:
          this.env === 'live'
            ? `https://api.ordinalsbot.com/marketplace/`
            : `https://testnet-api.ordinalsbot.com/marketplace/`,
        headers: headers,
      })

      client.interceptors.response.use(
        ({ data }) => ('data' in data ? data.data : data),
        (err) => {
          if (axios.isAxiosError(err)) {
            throw new InscriptionError(
              err.message,
              err.response?.statusText,
              err.response?.status
            )
          }

          if (err instanceof Error) throw err

          return err
        }
      )

      return client
    }

    this.instanceV1 = createInstance()
  }

  /**
   * Creates a new launchpad marketplace.
   * @param {LaunchpadMarketplaceCreateRequest} createMarketplaceRequest The request body for creating a new marketplace.
   * @returns {Promise<LaunchpadMarketplaceCreateResponse>} A promise that resolves to the response from the API.
   */
  async createMarketPlace(
    createMarketplaceRequest: LaunchpadMarketplaceCreateRequest
  ): Promise<LaunchpadMarketplaceCreateResponse> {
    return this.instanceV1.post(`/create-marketplace`, {
      ...createMarketplaceRequest,
    })
  }
}

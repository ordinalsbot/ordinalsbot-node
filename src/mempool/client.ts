import axios, { AxiosInstance } from 'axios'
import { InscriptionError } from '../inscription/error'
import {
  MempoolAddressUtxoResponse,
  RecommendedFees,
} from '../types/mempool_types'
import { InscriptionEnv } from '../types'

/**
 * A client for interacting with the Mempool API.
 */
export class MempoolClient {
  /**
   * The environment for the Mempool API (live or dev).
   */
  public env: InscriptionEnv

  /**
   * The API key used for authentication.
   */
  private api_key: string

  /**
   * The Axios instance for making HTTP requests.
   */
  private instanceV1: AxiosInstance

  /**
   * Creates a new MempoolClient instance.
   * @param key The API key (optional).
   * @param environment The environment (live or dev) (optional, defaults to live).
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    this.api_key = key
    this.env = environment

    /**
     * Creates a new Axios instance with appropriate headers.
     * @returns The new Axios instance.
     */
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
            ? `https://api.ordinalsbot.com/mempool/`
            : `https://testnet-api.ordinalsbot.com/mempool/`,
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
   * Gets the recommended fee estimation from the Mempool API.
   * @returns A promise that resolves to the recommended fees.
   */
  async getFeeEstimation(): Promise<RecommendedFees> {
    return this.instanceV1.get('api/v1/fees/recommended')
  }

  /**
   * Gets the UTXO (unspent transaction outputs) for a given address from the Mempool API.
   * @param address The address for which to fetch UTXO.
   * @returns A promise that resolves to an array of UTXO responses.
   */
  async getAddressUtxo(address: string): Promise<MempoolAddressUtxoResponse[]> {
    return this.instanceV1.get(`api/address/${address}/utxo`)
  }
}

import { MempoolClient } from './client'
import { InscriptionEnv } from '../types'
import {
  MempoolAddressUtxoResponse,
  RecommendedFees,
} from '../types/mempool_types'

/**
 * A interface for interacting with the Mempool API.
 */
export class Mempool {
  /**
   * The MempoolClient instance.
   */
  private mempoolInstance!: MempoolClient

  /**
   * Creates a new Mempool instance.
   * @param key The API key (optional).
   * @param environment The environment (live or dev) (optional, defaults to live).
   */
  constructor(key: string = '', environment: InscriptionEnv = 'live') {
    if (this.mempoolInstance !== undefined) {
      console.error('mempool.setCredentials was called multiple times')
      return
    }
    this.mempoolInstance = new MempoolClient(key, environment)
  }

  /**
   * Gets the recommended fee estimation from the Mempool API.
   * @returns A promise that resolves to the recommended fees.
   */
  getFeeEstimation(): Promise<RecommendedFees> {
    return this.mempoolInstance.getFeeEstimation()
  }

  /**
   * Gets the UTXO (unspent transaction outputs) for a given address from the Mempool API.
   * @param address The address for which to fetch UTXO.
   * @returns A promise that resolves to an array of UTXO responses.
   */
  getAddressUtxo(address: string): Promise<MempoolAddressUtxoResponse[]> {
    return this.mempoolInstance.getAddressUtxo(address)
  }
}

import * as bitcoin from 'bitcoinjs-lib'
import { InscriptionEnv } from '../types'
import { LaunchpadClient } from './client'
import { BitcoinNetworkType, SignTransactionResponse, signTransaction } from 'sats-connect'
import {
  ConfirmPaddingOutputsRequest,
  ConfirmPaddingOutputsResponse,
  CreateLaunchpadRequest,
  CreateLaunchpadResponse,
  GetAllocationRequest,
  GetAllocationResponse,
  GetListingRequest,
  GetListingResponse,
  LaunchpadMarketplaceCreateRequest,
  LaunchpadMarketplaceCreateResponse,
  SetupPaddingOutputsRequest,
  SetupPaddingOutputsResponse,
  getLaunchpadStatusRequest,
  getLaunchpadStatusResponse,
  saveLaunchpadRequest,
  saveLaunchpadResponse,
} from '../types/launchpad_types'
import { WALLET_PROVIDER } from '../types/marketplace_types'

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
  createMarketPlace(
    createMarketplaceRequest: LaunchpadMarketplaceCreateRequest
  ): Promise<LaunchpadMarketplaceCreateResponse> {
    return this.launchpadClientInstance.createMarketPlace(
      createMarketplaceRequest
    )
  }

  /**
   * Creates a new launchpad using the Launchpad API.
   * @param {CreateLaunchpadRequest} createLaunchpadRequest The request body for creating a new marketplace.
   * @returns {Promise<CreateLaunchpadResponse>} A promise that resolves to the response from the API.
   */
  async createLaunchpad(
    createLaunchpadRequest: CreateLaunchpadRequest
  ): Promise<CreateLaunchpadResponse | saveLaunchpadResponse> {
    try {
      if (!createLaunchpadRequest.walletProvider) {
        return await this.launchpadClientInstance.createLaunchpad(
          createLaunchpadRequest
        )
      } else if (
        createLaunchpadRequest.walletProvider === WALLET_PROVIDER.xverse
      ) {
        // Create the payload for signing the seller transaction
        if (!createLaunchpadRequest.sellerOrdinalAddress) {
          throw new Error('No seller address provided')
        }

        // Creates a new launchpad
        const { launchpadId, status } =
          await this.launchpadClientInstance.createLaunchpad(
            createLaunchpadRequest
          )

        let inputIndices: any = []
        let index = 0

        //input indices for the all the ordinals in the phase
        createLaunchpadRequest.phases.forEach((phase) => {
          phase.ordinals.forEach((ordinal) => {
            inputIndices.push(index)
            index++
          })
        })

        // seller input for sign the tractions
        const sellerInput = {
          address: createLaunchpadRequest.sellerOrdinalAddress,
          signingIndexes: inputIndices,
          sigHash:
            bitcoin.Transaction.SIGHASH_SINGLE |
            bitcoin.Transaction.SIGHASH_ANYONECANPAY,
        }

        const getLaunchpadStatusRequest = { launchpadId, status }
        // waiting for launchpad psbt
        const { psbt }: getLaunchpadStatusResponse =
          await this.getLaunchpadPSBT(getLaunchpadStatusRequest)

        // transaction request payload
        const payload = {
          network: { type: this.network },
          message: 'Sign Seller Transaction',
          psbtBase64: psbt,
          broadcast: false,
          inputsToSign: [sellerInput],
        }

        return new Promise((resolve, reject) => {
          signTransaction({
            payload,
            onFinish: async (response) => {
              try {
                console.log('Transaction signed')
                console.log('Response:', response)

                // contruct the request payload for save the launchpad after signing the transaction
                const saveLaunchpadRequestPayload: saveLaunchpadRequest = {
                  launchpadId: launchpadId,
                  updateLaunchData: {
                    signedListingPSBT: response.psbtBase64,
                  },
                }

                resolve(this.saveLaunchpad(saveLaunchpadRequestPayload))
              } catch (error) {
                console.error('Error saving launchpad:', error)
                reject(error)
              }
            },
            onCancel: () => {
              console.log('Transaction canceled')
            },
          })
        })
      } else {
        throw new Error('Wallet not supported')
      }
    } catch (error) {
      console.error('Error in create Launchpad:', error)
      throw error
    }
  }

  /**
   * Fetch status of the launchpad using the Launchpad API.
   * @param {getLaunchpadStatusRequest} getLaunchpadStatusRequest The request body for get launchpad status.
   * @returns {Promise<getLaunchpadStatusResponse>} A promise that resolves to the response from the API.
   */
  async getLaunchpadPSBT(
    getLaunchpadStatusRequest: getLaunchpadStatusRequest
  ): Promise<getLaunchpadStatusResponse> {
    let psbt = ''
    let status: any
    let intervalId: any

    const pollPSBTStatus = async () => {
      return new Promise((resolve) => {
        const checkAndResolve = async () => {
          const response: getLaunchpadStatusResponse =
            await this.launchpadClientInstance.getLaunchpadStatus(
              getLaunchpadStatusRequest
            )
          if (response.status !== status && response.psbt) {
            psbt = response.psbt
            status = response.status
            clearInterval(intervalId)
            resolve(psbt)
          }
        }

        intervalId = setInterval(checkAndResolve, 10000)
        checkAndResolve()

        setTimeout(() => {
          clearInterval(intervalId)
          resolve(psbt)
        }, 5 * 60 * 1000)
      })
    }
    await pollPSBTStatus()
    return { psbt, status }
  }

  /**
   * Updated the signed psbt by the seller on the launchpad
   * @param {saveLaunchpadRequest} saveLaunchpadRequest - The request body to update the launchpad data.
   * @returns {Promise<saveLaunchpadResponse>} A promise that resolves to the response from the API.
   */
  saveLaunchpad(
    saveLaunchpadRequest: saveLaunchpadRequest
  ): Promise<saveLaunchpadResponse> {
    return this.launchpadClientInstance.saveLaunchpad(saveLaunchpadRequest)
  }

  /**
   * Get all the launchpad listing
   * @param {GetListingRequest} getListingRequest - The request object for get all launchpad.
   * @returns {Promise<GetListingResponse>} A promise that resolves to the response from the API.
   */
  getLaunchpadListing(
    getListingRequest: GetListingRequest
  ): Promise<GetListingResponse> {
    return this.launchpadClientInstance.getLaunchpadListing(getListingRequest)
  }

  /**
   * Get buyer launhcpad allocation
   * @param {GetAllocationRequest} getAllocationRequest - The request object for buyer launhcpad allocations.
   * @returns {Promise<GetListingResponse>} A promise that resolves to the response from the API.
   */
  getAllocation(
    getAllocationRequest: GetAllocationRequest
  ): Promise<GetAllocationResponse> {
    return this.launchpadClientInstance.getAllocation(getAllocationRequest)
  }

  /**
   * Confirms Padding Outputs
   * @param {ConfirmPaddingOutputsRequest} confirmPaddingOutputsRequest - The request object for confirms padding outputs
   * @returns {Promise<ConfirmPaddingOutputsResponse>} A promise that resolves to the response from the API.
   */
  confirmPaddingOutputs(
    confirmPaddingOutputsRequest: ConfirmPaddingOutputsRequest
  ): Promise<ConfirmPaddingOutputsResponse> {
    return this.launchpadClientInstance.confirmPaddingOutputs(
      confirmPaddingOutputsRequest
    )
  }

  /**
   * Setup the padding output
   * @param {SetupPaddingOutputsRequest} setupPaddingOutputsRequest - The request object for buyer setup padding outputs.
   * @returns {Promise<SetupPaddingOutputsResponse>} A promise that resolves to the response from the API.
   */
  async setupPaddingOutputs(
    setupPaddingOutputsRequest: SetupPaddingOutputsRequest
  ): Promise<SetupPaddingOutputsResponse | SignTransactionResponse> {
    if (!setupPaddingOutputsRequest.walletProvider) {
      return this.launchpadClientInstance.setupPaddingOutputs(
        setupPaddingOutputsRequest
      )
    } else if (
      setupPaddingOutputsRequest.walletProvider === WALLET_PROVIDER.xverse
    ) {
      const paddingOutputResponse: SetupPaddingOutputsResponse =
        await this.launchpadClientInstance.setupPaddingOutputs(
          setupPaddingOutputsRequest
        )
      const buyerInputs = {
        address: setupPaddingOutputsRequest.address,
        signingIndexes: paddingOutputResponse.buyerInputIndices,
      }

      const payload = {
        network: {
          type: this.network,
        },
        message: 'Sign Padding Outputs Transaction',
        psbtBase64: paddingOutputResponse.psbt,
        broadcast: true,
        inputsToSign: [buyerInputs],
      }

      return new Promise((resolve, reject) => {
        signTransaction({
          payload,
          onFinish: async (response: any) => {
            return resolve(response)
          },
          onCancel: () => {
            console.log('Transaction canceled')
          },
        })
      })
    } else {
      throw new Error('Wallet not supported')
    }
  }
}

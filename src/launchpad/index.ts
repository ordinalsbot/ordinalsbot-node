import * as bitcoin from 'bitcoinjs-lib'
import { InscriptionEnv } from '../types'
import { LaunchpadClient } from './client'
import {
  BitcoinNetworkType,
  SignTransactionPayload,
  SignTransactionResponse,
  signTransaction,
} from 'sats-connect'
import {
  ConfirmPaddingOutputsRequest,
  ConfirmPaddingOutputsResponse,
  CreateLaunchpadOfferRequest,
  CreateLaunchpadOfferResponse,
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
  SubmitLaunchpadOfferRequest,
  SubmitLaunchpadOfferResponse,
  GetLaunchpadStatusRequest,
  GetLaunchpadStatusResponse,
  SaveLaunchpadRequest,
  SaveLaunchpadResponse,
  SatsConnectWrapperResponse,
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
   * @returns {Promise<CreateLaunchpadResponse | SaveLaunchpadResponse>} A promise that resolves to the response from the API.
   */
  async createLaunchpad(
    createLaunchpadRequest: CreateLaunchpadRequest
  ): Promise<CreateLaunchpadResponse | SaveLaunchpadResponse> {
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
        const { psbt }: GetLaunchpadStatusResponse =
          await this.getLaunchpadPSBT(getLaunchpadStatusRequest)

        // transaction request payload
        const payload = {
          network: { type: this.network },
          message: 'Sign Seller Transaction',
          psbtBase64: psbt,
          broadcast: false,
          inputsToSign: [sellerInput],
        }
        return new Promise(async (resolve, reject) => {
          const response: SatsConnectWrapperResponse =
            await this.satsConnectWrapper(payload)
          if (response && response.success && response.psbtBase64) {
            try {
              // contruct the request payload for save the launchpad after signing the transaction
              const saveLaunchpadRequestPayload: SaveLaunchpadRequest = {
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
          } else {
            console.log('Transaction canceled')
          }
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
   * @param {GetLaunchpadStatusRequest} getLaunchpadStatusRequest The request body for get launchpad status.
   * @returns {Promise<GetLaunchpadStatusResponse>} A promise that resolves to the response from the API.
   */
  async getLaunchpadPSBT(
    getLaunchpadStatusRequest: GetLaunchpadStatusRequest
  ): Promise<GetLaunchpadStatusResponse> {
    let psbt = ''
    let status: any
    let intervalId: any

    const pollPSBTStatus = async () => {
      return new Promise((resolve) => {
        const checkAndResolve = async () => {
          const response: GetLaunchpadStatusResponse =
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
   * @param {SaveLaunchpadRequest} saveLaunchpadRequest - The request body to update the launchpad data.
   * @returns {Promise<SaveLaunchpadResponse>} A promise that resolves to the response from the API.
   */
  saveLaunchpad(
    saveLaunchpadRequest: SaveLaunchpadRequest
  ): Promise<SaveLaunchpadResponse> {
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

      return new Promise(async (resolve, reject) => {
        const response: SatsConnectWrapperResponse = await this.satsConnectWrapper(payload)
        if (response && response.success && response.psbtBase64) {
          resolve({ psbtBase64: response.psbtBase64, txId: response.txId })
        } else {
          console.log('Transaction canceled')
        }
      })
    } else {
      throw new Error('Wallet not supported')
    }
  }

  /**
   * Creates the launchpad offer
   * @param {CreateLaunchpadOfferRequest} createOfferRequest - The request object for create Launchpad Offer.
   * @returns {Promise<CreateLaunchpadOfferResponse>} A promise that resolves to the response from the API.
   */
  async createLaunchpadOffer(
    createOfferRequest: CreateLaunchpadOfferRequest
  ): Promise<CreateLaunchpadOfferResponse | SubmitLaunchpadOfferRequest> {
    if (!createOfferRequest.walletProvider) {
      return this.launchpadClientInstance.createLaunchpadOffer(
        createOfferRequest
      )
    } else if (createOfferRequest.walletProvider === WALLET_PROVIDER.xverse) {
      const offer: CreateLaunchpadOfferResponse =
        await this.launchpadClientInstance.createLaunchpadOffer(
          createOfferRequest
        )
      const sellerInput = {
        address: createOfferRequest.buyerPaymentAddress,
        signingIndexes: offer.buyerInputIndices,
      }

      const payload = {
        network: {
          type: this.network,
        },
        message: 'Sign Buyer Transaction',
        psbtBase64: offer.psbt,
        broadcast: false,
        inputsToSign: [sellerInput],
      }
      
      return new Promise(async (resolve, reject) => {
        const response: SatsConnectWrapperResponse = await this.satsConnectWrapper(payload)
        if (response && response.success && response.psbtBase64) {
          /** this Response will be used for the next submit offer request */
          const submitLaunchpadOfferRequest: SubmitLaunchpadOfferRequest = {
            ordinalId: offer.ordinalId,
            launchpadPhase: offer.launchpadPhase,
            signedBuyerPSBTBase64: response.psbtBase64,
          }
          resolve(submitLaunchpadOfferRequest)
        } else {
          console.log('Transaction canceled')
        }
      })
    } else {
      throw new Error('Wallet not supported')
    }
  }

  /**
   * submits the launchpad offer and gets the tansaction id
   * @param {SubmitLaunchpadOfferRequest} submitLaunchpadOfferRequest - The request object for create Launchpad Offer.
   * @returns {Promise<SubmitLaunchpadOfferResponse>} A promise that resolves to the response from the API.
   */
  async submitLaunchpadOffer(
    submitLaunchpadOfferRequest: SubmitLaunchpadOfferRequest
  ): Promise<SubmitLaunchpadOfferResponse> {
    return this.launchpadClientInstance.submitLaunchpadOffer(
      submitLaunchpadOfferRequest
    )
  }

  /**
   * Sats connect Wrapper method to sign transactions
   * @param {SignTransactionPayload} payload The request payload for transaction.
   * @returns {Promise<SatsConnectWrapperResponse>} A promise that resolves to the response of transaction.
   */
  async satsConnectWrapper(
    payload: SignTransactionPayload
  ): Promise<SatsConnectWrapperResponse> {
    return new Promise((resolve, reject) => {
      signTransaction({
        payload,
        onFinish: async (response) => {
          resolve({
            success: true,
            message: 'Transaction successfull',
            ...response,
          })
        },
        onCancel: () => {
          resolve({ success: false, message: 'Transaction cancelled' })
        },
      })
    })
  }
}

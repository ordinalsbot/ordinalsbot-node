import axios, { AxiosInstance } from 'axios'
import { InscriptionEnv } from '../types'
import { InscriptionError } from '../InscriptionError'
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
            ? `https://api.ordinalsbot.com/launchpad/`
            : `https://testnet-api.ordinalsbot.com/launchpad/`,
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

  /**
   * Creates a new launchpad.
   * @param {CreateLaunchpadRequest} createLaunchpadRequest The request body for creating a new launchpad.
   * @returns {Promise<CreateLaunchpadResponse>} A promise that resolves to the response from the API.
   */
  async createLaunchpad(
    createLaunchpadRequest: CreateLaunchpadRequest
  ): Promise<CreateLaunchpadResponse> {
    return this.instanceV1.post(`/create-launch`, {
      ...createLaunchpadRequest,
    })
  }

  /**
   * gets launchpad status to sign traction.
   * @param {getLaunchpadStatusRequest} getLaunchpadStatusRequest The request body for get launchpad status.
   * @returns {Promise<getLaunchpadStatusResponse>} A promise that resolves to the response from the API.
   */
  async getLaunchpadStatus(
    getLaunchpadStatusRequest: getLaunchpadStatusRequest
  ): Promise<getLaunchpadStatusResponse> {
    return this.instanceV1.get(
      `/get-launch-psbt/${getLaunchpadStatusRequest.launchpadId}`
    )
  }

  /**
   * Updated the signed psbt by the seller on the launchpad
   * @param {saveLaunchpadRequest} saveLaunchpadRequest - The request body to update the launchpad data.
   * @returns {Promise<saveLaunchpadResponse>} A promise that resolves to the response from the API.
   */
  async saveLaunchpad(
    saveLaunchpadRequest: saveLaunchpadRequest
  ): Promise<saveLaunchpadResponse> {
    return this.instanceV1.post(`/save-launch`, {
      ...saveLaunchpadRequest,
    })
  }

  /**
   * Get all the launchpad listing
   * @param {GetListingRequest} getListingRequest - The request object for get all launchpad.
   * @returns {Promise<GetListingResponse>} A promise that resolves to the response from the API.
   */
  getLaunchpadListing(
    getListingRequest: GetListingRequest
  ): Promise<GetListingResponse> {
    return this.instanceV1.post(`/get-listings`, {
      ...getListingRequest,
    })
  }

  /**
   * Get buyer launhcpad allocation
   * @param {GetAllocationRequest} getAllocationRequest - The request object for buyer launhcpad allocations.
   * @returns {Promise<GetListingResponse>} A promise that resolves to the response from the API.
   */
  getAllocation(
    getAllocationRequest: GetAllocationRequest
  ): Promise<GetAllocationResponse> {
    return new Promise(async (resolve) => {
      try {
        resolve(
          await this.instanceV1.post(`/get-allocation`, {
            ...getAllocationRequest,
          })
        )
      } catch (error) {
        resolve({ phases: [] })
      }
    })
  }

  /**
   * Confirms Padding Outputs 
   * @param {ConfirmPaddingOutputsRequest} confirmPaddingOutputsRequest - The request object for confirms padding outputs 
   * @returns {Promise<ConfirmPaddingOutputsResponse>} A promise that resolves to the response from the API.
   */
  async confirmPaddingOutputs(
    confirmPaddingOutputsRequest: ConfirmPaddingOutputsRequest
  ): Promise<ConfirmPaddingOutputsResponse> {
    return this.instanceV1.post(`/confirm-padding-outputs`, {
      ...confirmPaddingOutputsRequest,
    });
  }

  /**
   * Setup the padding output
   * @param {SetupPaddingOutputsRequest} setupPaddingOutputsRequest - The request object for buyer setup padding outputs.
   * @returns {Promise<SetupPaddingOutputsResponse>} A promise that resolves to the response from the API.
   */
  async setupPaddingOutputs(
    setupPaddingOutputsRequest: SetupPaddingOutputsRequest
  ): Promise<SetupPaddingOutputsResponse> {
    return this.instanceV1.post(`/setup-padding-outputs`, {
      ...setupPaddingOutputsRequest,
    });
  }
}

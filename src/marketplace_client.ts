import axios, { AxiosInstance } from 'axios';
import { OrdinalsBotError } from './OrdinalsBotError';
import {
  MarketplaceCreateRequest,
  MarketplaceCreateResponse,
} from './types/markeplace_types';

export class MarketPlaceClient {
  private api_key: string;
  private instanceV1: AxiosInstance;

  constructor(key: string = '') {
    this.api_key = key;

    const createInstance = (): AxiosInstance => {
      const client = axios.create({
        baseURL: 'https://signet.ordinalsbot.com/api',
        headers: {
          'x-api-key': this.api_key,
          Connection: 'Keep-Alive',
          'Content-Type': 'application/json',
        },
      });

      client.interceptors.response.use(
        // normalize responses
        ({ data }) => ('data' in data ? data.data : data),
        (err) => {
          if (axios.isAxiosError(err)) {
            // added to keep compatibility with previous versions
            throw new OrdinalsBotError(
              err.message,
              err.response?.statusText,
              err.response?.status
            );
          }

          if (err instanceof Error) throw err;

          return err;
        }
      );

      return client;
    };

    this.instanceV1 = createInstance();
  }

  async createMarketPlace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.instanceV1.post(`/marketplace/create-marketplace`, {
      params: createMarketplaceRequest,
    });
  }
}

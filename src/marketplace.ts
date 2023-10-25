import { MarketPlaceClient } from "./marketplace_client";
import {
  MarketplaceCreateRequest,
  MarketplaceCreateResponse,
} from "./types/markeplace_types";

export class MarketPlace {
  private marketplaceInstance!: MarketPlaceClient;
  constructor(key: string = "") {
    if (this.marketplaceInstance !== undefined) {
      console.error("marketplace constructore was called multiple times");
      return;
    }
    this.marketplaceInstance = new MarketPlaceClient(key);
  }

  createMarketplace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.marketplaceInstance.createMarketPlace(createMarketplaceRequest);
  }
}

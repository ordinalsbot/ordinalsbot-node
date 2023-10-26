import { MarketPlaceClient } from "./marketplace_client";
import {
  MarketplaceCheckPaddingOutputRequest,
  MarketplaceCheckPaddingOutputResponse,
  MarketplaceCreateBuyOfferRequest,
  MarketplaceCreateBuyOfferResponse,
  MarketplaceCreatePaddingOutputsRequest,
  MarketplaceCreatePaddingOutputsResponse,
  MarketplaceCreateRequest,
  MarketplaceCreateResponse,
  MarketplaceGetListingResponse,
  MarketplaceListOridnalForSaleRequest,
  MarketplaceListOridnalForSaleResponse,
  MarketplaceSubmitBuyOfferRequest,
  MarketplaceSubmitBuyOfferResponse,
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

  listSaleForOrdinal(
    listSaleForOrdinalRequest: MarketplaceListOridnalForSaleRequest
  ): Promise<MarketplaceListOridnalForSaleResponse> {
    return this.marketplaceInstance.listSaleForOrdinal(
      listSaleForOrdinalRequest
    );
  }

  createBuyOffer(
    createBuyOfferRequest: MarketplaceCreateBuyOfferRequest
  ): Promise<MarketplaceCreateBuyOfferResponse> {
    return this.marketplaceInstance.createBuyOffer(createBuyOfferRequest);
  }

  submitBuyOffer(
    submitBuyOfferRequest: MarketplaceSubmitBuyOfferRequest
  ): Promise<MarketplaceSubmitBuyOfferResponse> {
    return this.marketplaceInstance.submitBuyOffer(submitBuyOfferRequest);
  }

  checkPaddingOutput(
    checkPaddingOutputRequest: MarketplaceCheckPaddingOutputRequest
  ): Promise<MarketplaceCheckPaddingOutputResponse> {
    return this.marketplaceInstance.checkPaddingOutput(
      checkPaddingOutputRequest
    );
  }

  createPaddingOutput(
    createPaddingOutputRequest: MarketplaceCreatePaddingOutputsRequest
  ): Promise<MarketplaceCreatePaddingOutputsResponse> {
    return this.marketplaceInstance.createPaddingOutput(
      createPaddingOutputRequest
    );
  }

  getListing(): Promise<MarketplaceGetListingResponse> {
    return this.marketplaceInstance.getListing();
  }
}

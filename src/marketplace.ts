import { MarketPlaceClient } from "./marketplace_client";
import { InscriptionEnv } from "./types";
import {
  MarketplaceConfirmPaddingOutputsRequest,
  MarketplaceConfirmPaddingOutputsResponse,
  MarketplaceCreateListingRequest,
  MarketplaceCreateListingResponse,
  MarketplaceCreateOfferRequest,
  MarketplaceCreateOfferResponse,
  MarketplaceSetupPaddingOutputsRequest,
  MarketplaceSetupPaddingOutputsResponse,
  MarketplaceCreateRequest,
  MarketplaceCreateResponse,
  MarketplaceGetListingResponse,
  MarketplaceSubmitOfferRequest,
  MarketplaceSubmitOfferResponse,
  MarketplaceGetListingRequest,
  MarketplaceSaveListingRequest,
  MarketplaceSaveListingResponse,
} from "./types/markeplace_types";

export class MarketPlace {
  private marketplaceInstance!: MarketPlaceClient;
  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.marketplaceInstance !== undefined) {
      console.error("marketplace constructore was called multiple times");
      return;
    }
    this.marketplaceInstance = new MarketPlaceClient(key, environment);
  }

  createMarketplace(
    createMarketplaceRequest: MarketplaceCreateRequest
  ): Promise<MarketplaceCreateResponse> {
    return this.marketplaceInstance.createMarketPlace(createMarketplaceRequest);
  }

  createListing(
    createListingRequest: MarketplaceCreateListingRequest
  ): Promise<MarketplaceCreateListingResponse> {
    return this.marketplaceInstance.createListing(createListingRequest);
  }

  createOffer(
    createOfferRequest: MarketplaceCreateOfferRequest
  ): Promise<MarketplaceCreateOfferResponse> {
    return this.marketplaceInstance.createOffer(createOfferRequest);
  }

  submitOffer(
    submitOfferRequest: MarketplaceSubmitOfferRequest
  ): Promise<MarketplaceSubmitOfferResponse> {
    return this.marketplaceInstance.submitOffer(submitOfferRequest);
  }

  confirmPaddingOutputs(
    confirmPaddingOutputsRequest: MarketplaceConfirmPaddingOutputsRequest
  ): Promise<MarketplaceConfirmPaddingOutputsResponse> {
    return this.marketplaceInstance.confirmPaddingOutputs(
      confirmPaddingOutputsRequest
    );
  }

  setupPaddingOutputs(
    setupPaddingOutputsRequest: MarketplaceSetupPaddingOutputsRequest
  ): Promise<MarketplaceSetupPaddingOutputsResponse> {
    return this.marketplaceInstance.setupPaddingOutputs(
      setupPaddingOutputsRequest
    );
  }

  getListing(
    getListingRequest: MarketplaceGetListingRequest
  ): Promise<MarketplaceGetListingResponse> {
    return this.marketplaceInstance.getListing(getListingRequest);
  }

  saveListing(
    saveListingRequest: MarketplaceSaveListingRequest
  ): Promise<MarketplaceSaveListingResponse> {
    return this.marketplaceInstance.saveListing(saveListingRequest);
  }
}

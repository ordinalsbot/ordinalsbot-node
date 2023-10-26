import { OrdinalsBotClient } from "./client";
import { OrdinalsBotEnv, v1 } from "./types";

export class OrdinalsBot {
  instance!: OrdinalsBotClient;

  constructor(key: string = "", environment: OrdinalsBotEnv = "live") {
    if (this.instance !== undefined) {
      console.error("ordinalsbot.setCredentials was called multiple times");
      return;
    }
    this.instance = new OrdinalsBotClient(key, environment);
  }

  getPrice(
    priceRequest: v1.OrdinalsBotPriceRequest
  ): Promise<v1.OrdinalsBotPriceResponse> {
    return this.instance.getPrice(priceRequest);
  }

  createOrder(order: v1.OrdinalsBotOrderRequest): Promise<v1.OrdinalsBotOrder> {
    return this.instance.createOrder(order);
  }

  getOrder(id: string): Promise<v1.OrdinalsBotOrder> {
    return this.instance.getOrder(id);
  }

  createCollection(
    collection: v1.OrdinalsBotCollectionCreateRequest
  ): Promise<v1.OrdinalsBotCollectionCreateResponse> {
    return this.instance.createCollection(collection);
  }

  createCollectionOrder(
    collectionOrder: v1.OrdinalsBotCollectionOrderRequest
  ): Promise<v1.OrdinalsBotOrder> {
    return this.instance.createCollectionOrder(collectionOrder);
  }

  createTextOrder(
    order: v1.OrdinalsBotTextOrderRequest
  ): Promise<v1.OrdinalsBotOrder> {
    return this.instance.createTextOrder(order);
  }

  getInventory(): Promise<v1.OrdinalsBotInventoryResponse[]> {
    return this.instance.getInventory();
  }

  setReferralCode(
    referral: v1.OrdinalsBotReferralRequest
  ): Promise<v1.OrdinalsBotReferralSetResponse> {
    return this.instance.setReferralCode(referral);
  }

  getReferralStatus(
    referral: v1.OrdinalsBotReferralRequest
  ): Promise<v1.OrdinalsBotReferralStatusResponse> {
    return this.instance.getReferralStatus(referral);
  }
}

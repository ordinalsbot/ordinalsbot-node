import { InscriptionClient } from "./client";
import { InscriptionEnv, v1 } from "./types";

export class Inscription {
  instance!: InscriptionClient;

  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.instance !== undefined) {
      console.error("inscription.setCredentials was called multiple times");
      return;
    }
    this.instance = new InscriptionClient(key, environment);
  }

  getPrice(
    priceRequest: v1.InscriptionPriceRequest
  ): Promise<v1.InscriptionPriceResponse> {
    return this.instance.getPrice(priceRequest);
  }

  createOrder(order: v1.InscriptionOrderRequest): Promise<v1.InscriptionOrder> {
    return this.instance.createOrder(order);
  }

  getOrder(id: string): Promise<v1.InscriptionOrder> {
    return this.instance.getOrder(id);
  }

  createCollection(
    collection: v1.InscriptionCollectionCreateRequest
  ): Promise<v1.InscriptionCollectionCreateResponse> {
    return this.instance.createCollection(collection);
  }

  createCollectionOrder(
    collectionOrder: v1.InscriptionCollectionOrderRequest
  ): Promise<v1.InscriptionOrder> {
    return this.instance.createCollectionOrder(collectionOrder);
  }

  createTextOrder(
    order: v1.InscriptionTextOrderRequest
  ): Promise<v1.InscriptionOrder> {
    return this.instance.createTextOrder(order);
  }

  getInventory(): Promise<v1.InscriptionInventoryResponse[]> {
    return this.instance.getInventory();
  }

  setReferralCode(
    referral: v1.InscriptionReferralRequest
  ): Promise<v1.InscriptionReferralSetResponse> {
    return this.instance.setReferralCode(referral);
  }

  getReferralStatus(
    referral: v1.InscriptionReferralRequest
  ): Promise<v1.InscriptionReferralStatusResponse> {
    return this.instance.getReferralStatus(referral);
  }
}

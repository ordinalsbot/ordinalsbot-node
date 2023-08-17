import { OrdinalsBotClient } from "./client";
import { OrdinalsBotEnv, v1 } from "./types";

export { OrdinalsBotClient } from "./client";
export { OrdinalsBotError } from "./OrdinalsBotError";
export * from "./types";

let instance!: OrdinalsBotClient;

export function setCredentials(
  key: string = "",
  environment: OrdinalsBotEnv = "live"
): void {
  if (instance !== undefined) {
    console.error(
      "ordinalsbot.setCredentials was called multiple times",
    );
    return;
  }
  instance = new OrdinalsBotClient(key, environment);
}

export function getPrice(
  priceRequest: v1.OrdinalsBotPriceRequest
): Promise<v1.OrdinalsBotPriceResponse> {
  return instance.getPrice(priceRequest);
}

export function createOrder(
  order: v1.OrdinalsBotOrderRequest
): Promise<v1.OrdinalsBotOrder> {
  return instance.createOrder(order);
}

export function getOrder(id: string): Promise<v1.OrdinalsBotOrder> {
  return instance.getOrder(id);
}

export function createCollection(
  collection: v1.OrdinalsBotCollectionCreateRequest
): Promise<v1.OrdinalsBotCollectionCreateResponse> {
  return instance.createCollection(collection);
}

export function createCollectionOrder(
  collectionOrder: v1.OrdinalsBotCollectionOrderRequest
): Promise<v1.OrdinalsBotOrder> {
  return instance.createCollectionOrder(collectionOrder);
}

export function createTextOrder(
  order: v1.OrdinalsBotTextOrderRequest
): Promise<v1.OrdinalsBotOrder> {
  return instance.createTextOrder(order);
}

export function getInventory(): Promise<v1.OrdinalsBotInventoryResponse[]> {
  return instance.getInventory();
}

export function setReferralCode(
  referral: v1.OrdinalsBotReferralRequest
): Promise<v1.OrdinalsBotReferralSetResponse> {
  return instance.setReferralCode(referral);
}

export function getReferralStatus(
  referral: v1.OrdinalsBotReferralRequest
): Promise<v1.OrdinalsBotReferralStatusResponse> {
  return instance.getReferralStatus(referral);
}

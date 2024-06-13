export * as v1 from "./v1";

/**
 * Represents the different environment options available.
 */
export type InscriptionEnv = "live" | "dev" | "mainnet" | "signet" | "testnet";

/**
 * Export ClientOptions from the options module.
 * @module options
 */
export { ClientOptions } from "./options";

/**
 * Enum for mapping InscriptionEnv values to their respective network names.
 * @enum {string}
 */
export enum InscriptionEnvNetwork {
  dev = "testnet",
  testnet = "testnet",
  live = "mainnet",
  mainnet = "mainnet",
  signet = "signet",
}

/**
 * Enum for mapping InscriptionEnv values to their respective network explorer URLs.
 * @enum {string}
 */
export enum EnvNetworkExplorer {
  dev = "https://testnet-api.ordinalsbot.com",
  live = "https://api.ordinalsbot.com",
  testnet = "https://testnet-api.ordinalsbot.com",
  mainnet = "https://api.ordinalsbot.com",
  signet = "https://signet-api.ordinalsbot.com",
}

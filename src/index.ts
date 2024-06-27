import { Inscription } from "./inscription/index";
import { Launchpad } from "./launchpad/index";
import { MarketPlace } from "./marketplace";
import { Mempool } from "./mempool/index";
import { Satextractor } from "./satextractor/index";
import { Satscanner } from "./satscanner/index";
import { TokenPay } from './tokenpay/index';
import { ClientOptions, InscriptionEnv, InscriptionEnvNetwork } from "./types";

export { InscriptionClient } from "./client";
export { InscriptionError } from "./inscription/error";
export * from "./types";
export { MarketPlace } from "./marketplace";
export { Inscription } from "./inscription/index";
export { Satscanner } from "./satscanner/index";
export { Satextractor } from "./satextractor/index";
export { Mempool } from "./mempool/index";
export { TokenPay } from "./tokenpay/index";


/**
 * Represents a bot for managing marketplaces and inscriptions.
 */
export class Ordinalsbot {
  /**
   * The marketplace instance.
   */
  private marketPlaceObj!: MarketPlace;

  /**
   * The inscription instance.
   */
  private inscriptionObj!: Inscription;

  /**
   * The launchpad instance.
   */
  private launchpadObj!: Launchpad;

  /**
   * The Mempool instance.
   */
  private mempoolObj!: Mempool;

  /**
   * The Satextractor instance.
   */
  private satextractorObj!: Satextractor;

  /**
   * The satscanner instance.
   */
  private satscannerObj!: Satscanner;

  /**
   * The tokenpay instance.
   */
  private tokenpayObj!: TokenPay;

  /**
   * Creates an instance of Ordinalsbot.
   * @param {string} key - The API key for authentication.
   * @param {InscriptionEnv} [environment='mainnet'] - The environment (e.g., "testnet" , "mainnet", "signet") (optional, defaults to mainnet).
   * @param {ClientOptions} [options] - Options for enabling L402 support.
  */
  constructor(key: string = "", environment: InscriptionEnv = InscriptionEnvNetwork.mainnet, options?: ClientOptions) {
  
    environment = InscriptionEnvNetwork[environment]??InscriptionEnvNetwork.mainnet;
    /**
     * initialising the marketplace instance
     */
    if (this.marketPlaceObj === undefined) {
      this.marketPlaceObj = new MarketPlace(key, environment, options);
    }

    /**
     * initialising the inscription instance
     */
    if (this.inscriptionObj === undefined) {
      this.inscriptionObj = new Inscription(key, environment, options);
    }

    /**
     * initialising the launchpad instance
     */
    if (this.launchpadObj === undefined) {
      this.launchpadObj = new Launchpad(key, environment, options);
    }

    /**
     * initialising the mempool instance
     */
    if (this.mempoolObj === undefined) {
      this.mempoolObj = new Mempool(key, environment, options);
    }

    /**
     * initialising the satextractor instance
     */
    if (this.satextractorObj === undefined) {
      this.satextractorObj = new Satextractor(key, environment, options);
    }

    /**
     * initialising the satextractor instance
     */
    if (this.satscannerObj === undefined) {
      this.satscannerObj = new Satscanner(key, environment, options);
    }
    
    /**
     * initialising the tokenpay instance
     */
    if (this.tokenpayObj === undefined) {
      this.tokenpayObj = new TokenPay(key, environment, options);
    }
  }

  /**
   * Returns the marketplace instance.
   * @returns {MarketPlace} The marketplace instance.
   */
  MarketPlace(): MarketPlace {
    return this.marketPlaceObj;
  }

  /**
   * Returns the inscription instance.
   * @returns {Inscription} The inscription instance.
   */
  Inscription(): Inscription {
    return this.inscriptionObj;
  }

  /**
   * Returns the launchpad instance.
   * @returns {Launchpad} The launchpad instance.
   */
  Launchpad(): Launchpad {
    return this.launchpadObj;
  }

  /**
   * Returns the mempool instance.
   * @returns {Mempool} The mempool instance.
   */
  Mempool(): Mempool {
    return this.mempoolObj;
  }

  /**
   * Returns the satextractor instance.
   * @returns {Satextractor} The satextractor instance.
   */
  Satextractor(): Satextractor {
    return this.satextractorObj;
  }

  /**
   * Returns the Satscanner instance.
   * @returns {Satscanner} The Satscanner instance.
   */
  Satscanner(): Satscanner {
    return this.satscannerObj;
  }
  
  /**
   * Returns the TokenPay instance.
   * @returns {TokenPay} The TokenPay instance.
   */
  TokenPay(): TokenPay {
    return this.tokenpayObj;
  }
}

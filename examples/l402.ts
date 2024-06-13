import { AlbyWallet, MemoryTokenStore } from "l402";
const { Client } = require('@getalby/sdk');
import { ClientOptions, Satscanner } from "../src";
require('dotenv').config();

// Load the Alby token from an environment variable
const albyToken = process.env.ALBY_BEARER_TOKEN;
if (!albyToken) {
    console.error('Missing ALBY_BEARER_TOKEN environment variable.');
    process.exit(1);
}

const albyClient = new Client(albyToken)

// Initialize the AlbyWallet using the bearer token
const albyWallet = new AlbyWallet(albyClient);

// Initialize the MemoryTokenStore
const store = new MemoryTokenStore({
  keyMode: 'hostname-only' // this is IMPORTANT, since all endpoints are monetized 
                           // using the same hostname-level package ie. the same 
                           // L402 token can be used for all endpoints.
});

// Create Options
const options: ClientOptions = {
    useL402: true,
    l402Config: {
        wallet: albyWallet,
        tokenStore: store
    }
};

/**
 * Create a new Satscanner instance
 * Setup your API Key and environment
 * Allowed environments are ('testnet', 'mainnet', 'signet')
 * default environment is 'mainnet'.
 */
const satscanner = new Satscanner("", "mainnet", options);

/**
 * use satscanner to get information about utxos owned by an address
 */

/**
 * Using promises
 */
(async () => {
    try {
      const response = await satscanner.findSpecialRanges({ address: "bc1pjqmzr4ad437ltvfyn8pslcy8quls9ujfkrudpz6qxdh2j75qrncq44mp47" });
      console.log(response);
    } catch (error) {
      console.error(`${error.status} | ${error.message} | ${error.data}`);
    }
  })();
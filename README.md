# OrdinalsBot Node.js Library

[![Version](https://img.shields.io/npm/v/ordinalsbot.svg)](https://www.npmjs.org/package/ordinalsbot)
[![](https://badgen.net/npm/dt/ordinalsbot)](https://www.npmjs.com/package/ordinalsbot)
[![Try ordinalsbot on RunKit](https://badge.runkitcdn.com/ordinalsbot.svg)](https://npm.runkit.com/ordinalsbot)

The OrdinalsBot Node library provides convenient access to the OrdinalsBot API from
applications written in JavaScript.

## Documentation

You can find examples [here](examples/example.ts). For more information refer to our [API docs](https://docs.ordinalsbot.com).

## Installation

Install the package with:

    npm install ordinalsbot --save
    or
    yarn add ordinalsbot

## Import and intialization

The package needs to be configured with your account's API key which you can get by opening a ticket in our Discord for now. Our developer dashboard is coming soon...

```js
import { Ordinalsbot } from "ordinalsbot";

/**
 * Creates a new instance of Ordinalsbot with the provided API key, network type, optional TokenPay API key, and options.
 *
 * @param {string} API_KEY - The API key to authenticate requests.
 * @param {string} network - The network type to be used. Allowed values are 'testnet', 'mainnet', 'signet'. Defaults to 'mainnet'.
 * @param {string} [TOKENPAY_API_KEY] - Optional API key for TokenPay.
 * @param {ClientOptions} [options] - Optional configuration options for the client.
 * @returns {Ordinalsbot} An instance of the Ordinalsbot class.
 */
const ordinalsbotObj = new Ordinalsbot(API_KEY, "testnet", TOKENPAY_API_KEY);
const marketPlace = ordinalsbotObj.MarketPlace();
const inscription = ordinalsbotObj.Inscription();
const launchpad = ordinalsbotObj.Launchpad();
const mempool = ordinalsbotObj.Mempool();
const satextractor = ordinalsbotObj.Satextractor();
const satscanner = ordinalsbotObj.Satscanner();
// To use TokenPay, the `TOKENPAY_API_KEY` must be passed to the Ordinalsbot class
const tokenPay = ordinalsbotObj.TokenPay();
```

## Usage

```js
try {
  // create new order
  const order = await inscription.createOrder({
    files: [
      {
        size: 10,
        type: "plain/text",
        name: "my-text-inscription-file.txt",
        dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
      },
    ],
    lowPostage: true,
    receiveAddress: "",
    fee: 11,
  });
  console.log("Order: ", order);
} catch (error) {
  console.log("Exception: ", error);
}

try {
  // get marketplace listings
  const listing = await marketplace.getListing();
  console.log("Marketplaces: ", listing);
} catch (e) {
  console.log("Exception: ", e);
}
```

### Using Promises

Every method returns a chainable promise which can be used instead of a regular
callback:

```js
// create new order
inscription
  .createOrder({
    files: [
      {
        size: 10,
        type: "plain/text",
        name: "my-text-inscription-file.txt",
        dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
      },
    ],
    lowPostage: true,
    receiveAddress: "",
    fee: 11,
  })
  .then((order) => {
    console.log("Order: ", order);
  })
  .catch((error) => {
    console.log("Exception: ", error);
  });

// get marketplace listings
marketplace
  .getListing()
  .then((listings) => {
    console.log("Order: ", listings);
  })
  .catch((error) => {
    console.log("Exception: ", error);
  });
```

### Run examples   
You can check and run examples after setting your API Key   
```
npx ts-node examples/example.ts
```

### Using Wallets on the client side

For client-side applications, the methods `marketplace.createListing()`, `marketplace.createOffer()`, and `marketplace.setupPaddingOutputs()` support the `walletProvider` parameter. This optional string parameter allows for specifying the wallet name, with current support for the Xverse wallet and plans to include additional wallets soon. When the `walletProvider` parameter is specified it triggers the invocation of the specified wallet, prompting the user to sign the transaction. This integration significantly streamlines the process by reducing the need for multiple API calls and simplifies the structuring of data required for wallet invocation and transaction signing. 

The following example demonstrates how to create a listing for sale. When you invoke `marketplace.createListing()` and specify `"xverse"` as the `walletProvider`, it initiates an API call to generate a listing transaction. The method processes the response, formatting the data according to the requirements of the Xverse wallet. Subsequently, the Xverse wallet is activated to prompt the user to sign the transaction. Once the user successfully signs, this method additionally triggers the `save-listing` API, using the appropriately formatted data. Finally, it returns the confirmed listing information as the response.

```js
import { Ordinalsbot } from "ordinalsbot";

/**
 * Creates a new instance of Ordinalsbot with the provided API key, network type, optional TokenPay API key, and options.
 *
 * @param {string} API_KEY - The API key to authenticate requests.
 * @param {string} network - The network type to be used. Allowed values are 'testnet', 'mainnet', 'signet'. Defaults to 'mainnet'.
 * @param {string} [TOKENPAY_API_KEY] - Optional API key for TokenPay.
 * @param {ClientOptions} [options] - Optional configuration options for the client.
 * @returns {Ordinalsbot} An instance of the Ordinalsbot class.
 */
const ordinalsbotObj = new Ordinalsbot(API_KEY, "testnet");
const marketPlace = ordinalsbotObj.MarketPlace();

const listingRequest = {
  sellerOrdinals: [{
    id: "0c9ac6fb5d4516aade728882e230b0d78337732ea71915c7fbc0cdabe5d29f3ci0",
    price: "1234"
  }],
  sellerPaymentAddress: "2NAurbuXjBK5dztb416bh98ibDS7MKxV75C",
  sellerOrdinalPublicKey: "594a4aaf5da5b144d0fa6b47987d966029d892fbc4aebb23214853e8b053702e",
  sellerOrdinalAddress: "tb1p79l2gnn7u8uqxfepd7ddeeajzrmuv9nkl20wpf77t2u473a2h89s483yk3",
  walletProvider: WALLET_PROVIDER.xverse
};

//call the marketplace listing method
const response = await marketPlace.createListing(listingRequest);

// this will invoke wallet and prompt the user to sign the transaction
// Once signed the listing data will be saved and the saved listing will be
// returned as the response

```

### Using L402 for API Access

[L402](https://docs.sulu.sh/docs/introduction-to-L402) is an alternative way to pay and authenticate access to an API, powered natively by Bitcoin and the Lightning Network. With L402, developers do not need an auth key to use an API. Instead, a micro lightning payment is requested for anonymous authentication. Once payment has been done, the preimage of the payment is used as proof-of-payment to grant access to API resources for a limited amount of calls. 

OrdinalsBot has partnered with [Sulu](https://www.sulu.sh/) to offer developers all across the world access to their APIs through L402. All current OrdinalsBot endpoints can be paid for and accessed through L402 using the hostname `https://ordinalsbot.ln.sulu.sh` .

For a price of `5 sats for 5 calls` developers can access any endpoint without rate limits or needing to obtain an auth key.

Furthermore, Sulu has integrated L402 functionality into the OrdinalsBot Node.js Library. With access to a Lightning Node or wallet, developers can seamlessly pay for usage of the OrdinalsBot API using Bitcoin: 

```javascript
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

// Create Options to enable L402 access
const options: ClientOptions = {
    useL402: true,
    l402Config: {
        wallet: albyWallet,
        tokenStore: store
    }
};

// Create a new Satscanner instance
// Allowed environments are ('testnet', 'mainnet', 'signet')
// default environment is 'mainnet'.
const satscanner = new Satscanner("", "mainnet", options);

/**
 * use satscanner to get information about utxos owned by an address
 */
(async () => {
    try {
      const response = await satscanner.findSpecialRanges({ address: "bc1pjqmzr4ad437ltvfyn8pslcy8quls9ujfkrudpz6qxdh2j75qrncq44mp47" });
      console.log(response);
    } catch (error) {
      console.error(`${error.status} | ${error.message} | ${error.data}`);
    }
  })();
```

For more details on how the integration works, check out Sulu's `l402` [NPM package](https://www.npmjs.com/package/l402). At the time of writing, the[ Alby Wallet](https://getalby.com/) is the only officially supported wallet, but developers are free to write their own wallet integrations implementing the Wallet interface in the `l402` package.

## Testing
`npm run test`

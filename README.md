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
import { MarketPlace, OrdinalsBot } from "ordinalsbot";

// if no parameter given, default environment is 'live'
let oridnalsBot = new OrdinalsBot("MY_API_KEY", "dev");
let marketplace = new MarketPlace("API_KEY", "dev");
```

## Usage

```js
try {
  // create new order
  const order = await oridnalsBot.createOrder({
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
oridnalsBot
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

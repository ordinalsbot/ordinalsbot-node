import {Inscription} from "../src";

/**
 * Setup your API Key and environment
 * Allowed environments are ('testnet', 'mainnet', 'signet')
 * default environment is 'mainnet'.
 */
const inscription = new Inscription("", "testnet");

/**
 *
 * Fetch order information
 */

/**
 * Using promises
 */

inscription
  .getOrder("8a285e04-2973-40c3-a50b-4302c83f1d85")
  .then((order) => {
    console.log(order);
  })
  .catch((error) => {
    console.error(`${error.status} | ${error.message}`);
  });

/**
 *
 * Using async/await
 */
(async () => {
  try {
    const data = await inscription.getOrder(
      "8a285e04-2973-40c3-a50b-4302c83f1d85"
    );
    console.log(data);
  } catch (error) {
    console.error(`${error.status} | ${error.message}`);
  }
})();

/**
 *
 * Creating a order
 */

const order = {
    files: [
        {
          size: 10,
          type: "plain/text",
          name: "my-text-inscription-file.txt",
          dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
        }
    ],
    lowPostage: true,
    receiveAddress: "",
    fee: 11
}

/**
 * Using promises
 */

inscription
  .createOrder(order)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(`${error.status} | ${error.message}`);
  });

/**
 * Using async/await
 */

(async () => {
  try {
    const response = await inscription.createOrder(order);
    console.log(response);
  } catch (error) {
    console.error(`${error.status} | ${error.message}`);
  }
})();

/**
 *
 * Creating a text order
 */

const textOrder = {
    texts: ["This is an example text inscription."],
    lowPostage: true,
    receiveAddress: "",
    fee: 11
}

inscription
    .createTextOrder(textOrder)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(`${error.status} | ${error.message}`);
    });

/**
 * Creating a runes etching order
 */
const runesEtchOrder = {
  files: [
      {
        size: 10,
        type: "plain/text",
        name: "my-runes-file.txt",
        dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
      }
  ],
  turbo: true,
  rune: 'THIRTEENCHARS',
  supply: 10000,
  symbol: 'D',
  premine: 0,
  divisibility: 10,
  fee: 510,
  receiveAddress: 'tb1p4mn7h5nsdtuhkkhlvg30hyfglz30whtgfs8qwr2efdjvw0yqm4cquzd8m7',
  terms: {
    amount: 1,
    cap: 10000,
    height: {
      start: 8000010,
      end: 9000010,
    },
  },
};

(async () => {
  try {
    const response = await inscription.createRunesEtchOrder(runesEtchOrder);
    console.log(response);
  } catch (error) {
    console.error(`${error.status} | ${error.message}`);
  }
})();

/**
 * Creating a runes mint order
 */
const runesMintOrder = {
  rune: 'UNCOMMON.GOODS',
  numberOfMints: 2,
  fee: 510,
  receiveAddress: 'tb1p4mn7h5nsdtuhkkhlvg30hyfglz30whtgfs8qwr2efdjvw0yqm4cquzd8m7',
};

(async () => {
  try {
    const response = await inscription.createRunesMintOrder(runesMintOrder);
    console.log(response);
  } catch (error) {
    console.error(`${error.status} | ${error.message}`);
  }
})();

/**
 * Create a tokenpay order
 */
import { TokenPay } from "../src";
const tokenpayApiKey = ""; // this can not be blank
const tokenpay = new TokenPay("", "testnet", tokenpayApiKey);

(async () => {
  try {
    const data = await tokenpay.createRuneOrder({
      amount: 100,
      token: 'TOKENPAY•TOKEN',
      description: 'This is a test order',
    });
    console.log(data);
  } catch (error) {
    console.error(`${error.status} | ${error.message}`);
  }
})();

/** Satscanner - API Key is required */
import { Satscanner } from "../src";

/**
 * Setup your API Key and environment
 * Allowed environments are ('testnet', 'mainnet', 'signet')
 * default environment is 'mainnet'.
 */
const satscanner = new Satscanner("", "testnet");

/**
 * use satscanner to get information about utxos owned by an address
 */

/**
 * Using promises
 */

satscanner
  .findSpecialRanges({ address: "bc1pjqmzr4ad437ltvfyn8pslcy8quls9ujfkrudpz6qxdh2j75qrncq44mp47" })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(`${error.status} | ${error.message} | ${error.data}`);
  });

/**
 * Using async/await
 */

(async () => {
  try {
    const response = await satscanner.findSpecialRanges({ address: "bc1pjqmzr4ad437ltvfyn8pslcy8quls9ujfkrudpz6qxdh2j75qrncq44mp47" })
    console.log(response);
  } catch (error) {
    console.error(`${error.status} | ${error.message} | ${error.data}`);
  }
})();



/** Satextractor - API Key is required */
import { Satextractor } from "../src";

/**
 * Setup your API Key and environment
 * Allowed environments are ('testnet', 'mainnet', 'signet')
 * default environment is 'mainnet'.
 */
const satextractor = new Satextractor("", "testnet");

/**
 * use satextractor to get a transaction that extracts special sats from an address's utxos
 */

/**
 * Using promises
 */

satextractor
  .extract({
    "scanAddress": "bc1pshuvzr7x8y3fj362dl2excxx0n69xq42tguxsfrhvmvkre7404gs9cz40h",
    "addressToSendSpecialSats" : "bc1pgnwmg7wplc09cm9fctgmgalu7l4synjh7khwzre9qlcvg5xy0k5qz9mwe3",
    "addressToSendCommonSats": "bc1qq2ealrqzjf6da2l6czkwvtulmkh8m07280kq3q",
    "feePerByte": 30,
    "filterSatributes" : []
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(`${error.status} | ${error.message} | ${error.data}`);
  });

/**
 * Using async/await
 */

(async () => {
  try {
    const response = await satextractor.extract({
      "scanAddress": "bc1pshuvzr7x8y3fj362dl2excxx0n69xq42tguxsfrhvmvkre7404gs9cz40h",
      "addressToSendSpecialSats" : "bc1pgnwmg7wplc09cm9fctgmgalu7l4synjh7khwzre9qlcvg5xy0k5qz9mwe3",
      "addressToSendCommonSats": "bc1qq2ealrqzjf6da2l6czkwvtulmkh8m07280kq3q",
      "feePerByte": 30,
      "filterSatributes" : []
    })
    console.log(response);
  } catch (error) {
    console.error(`${error.status} | ${error.message} | ${error.data}`);
  }
})();




/** Mempool - API Key is required */
import { Mempool } from "../src";

/**
 * Setup your API Key and environment
 * Allowed environments are ('testnet', 'mainnet', 'signet')
 * default environment is 'mainnet'.
 */
const mempool = new Mempool("", "testnet");

/**
 * use mempool to get information about the bitcoin blockchain
 */

/**
 * Using promises
 */

mempool
  .getAddressUtxo("2N4v1yyB5arLfQ3wHgAroRYmb49LVedkkYg")
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(`${error.status} | ${error.message} | ${error.data}`);
  });

/**
 * Using async/await
 */

(async () => {
  try {
    const response = await mempool.getAddressUtxo("2N4v1yyB5arLfQ3wHgAroRYmb49LVedkkYg")
    console.log(response);
  } catch (error) {
    console.error(`${error.status} | ${error.message} | ${error.data}`);
  }
})();
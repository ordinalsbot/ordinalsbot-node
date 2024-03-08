import {Inscription} from "../src";

/**
 * Setup your API Key and environment
 */
const inscription = new Inscription("", "dev");

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



/** Satscanner - API Key is required */
import { Satscanner } from "../src";
const satscanner = new Satscanner("", "dev");

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

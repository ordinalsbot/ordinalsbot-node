import * as ordinalsbot from "../src";

/**
 * Setup your API Key and environment
 */
ordinalsbot.setCredentials("MY_API_KEY", "dev");

/**
 *
 * Fetch order information
 */

/**
 * Using promises
 */

ordinalsbot
  .getOrder("6a245608-5e81-46f6-b533-5741e3a06c42")
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
    const data = await ordinalsbot.getOrder(
      "6a245608-5e81-46f6-b533-5741e3a06c42"
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

ordinalsbot
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
    const response = await ordinalsbot.createOrder(order);
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

ordinalsbot
    .createTextOrder(textOrder)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(`${error.status} | ${error.message}`);
    });
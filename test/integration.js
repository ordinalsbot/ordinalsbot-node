const { assert, expect } = require("chai");
const { OrdinalsBot } = require("../dist");
const { v4 } = require("uuid");

// empty credentials should work except for collection-order
const ordinalsbot = new OrdinalsBot("", "dev");

const sampleOrderId1 = "1be4ea8a-587d-43c2-85bb-d6fe6f15fcb8";
const sampleOrderId2 = "1adb8300-c89d-4ab1-8323-7797a483747c";

describe("order", function () {
  describe("get price", function () {
    it("should return a price of order", async () => {
      let price, err;

      try {
        price = await ordinalsbot.getPrice({ size: 150, fee: 2 });
      } catch (error) {
        err = error;
      } finally {
        expect(err).to.be.an("undefined");
        assert.deepEqual(price.postage, 10000);
      }
    });
  });

  describe("create order", function () {
    it("should return a order object", async () => {
      let order, err;

      try {
        order = await ordinalsbot.createOrder({
          files: [
            {
              size: 10,
              type: "plain/text",
              name: "test-my-text-inscription-file.txt",
              dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
            },
          ],
          lowPostage: true,
          receiveAddress: "",
          fee: 10,
          timeout: 1440,
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err).to.be.an("undefined");
        assert.deepEqual(order.status, "ok");
      }
    });
  });

  describe("get order", function () {
    it("should return a order object", async () => {
      let order, err;

      try {
        order = await ordinalsbot.getOrder(sampleOrderId1);
      } catch (error) {
        err = error;
      } finally {
        expect(err).to.be.an("undefined");
        assert.deepEqual(order.id, sampleOrderId1);
      }
    });
  });

  describe("create order with invalid parameters", function () {
    it("should return a (400) Bad Request", async () => {
      let order, err;

      try {
        order = await ordinalsbot.createOrder({
          description: "hello world",
        });
      } catch (error) {
        err = error;
      } finally {
        assert.deepEqual(order.status, "error");
      }
    });
  });

  describe("create collection order", function () {
    it("should return a collection object", async () => {
      let collection, err;

      try {
        collection = await ordinalsbot.createCollection({
          id: v4(),
          name: "collection name",
          description: "test description",
          creator: "creator",
          price: 100,
          totalCount: "50",
          files: [{ name: "test.txt", url: "https://example.com", size: 50 }],
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err).to.be.an("undefined");
        assert.deepEqual(collection.status, 200);
      }
    });
  });
});

describe("client", function () {
  it("should allow multiple clients with different credentials", async () => {
    let order1, order2, err;
    const client1 = new OrdinalsBot("test1", "dev");
    const client2 = new OrdinalsBot("test2", "dev");

    try {
      order1 = await client1.getOrder(sampleOrderId1);
      order2 = await client2.getOrder(sampleOrderId2);
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.be.an("undefined");
      assert.deepEqual(order1.id, sampleOrderId1);
      assert.deepEqual(order2.id, sampleOrderId2);
    }
  });
});

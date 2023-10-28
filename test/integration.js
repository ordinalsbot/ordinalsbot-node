const { assert, expect } = require('chai');
const ordinalsbot = require('../dist');

// empty credentials should work except for collection-order
ordinalsbot.setCredentials('', 'dev');

const sampleOrderId1 = '1be4ea8a-587d-43c2-85bb-d6fe6f15fcb8'
const sampleOrderId2 = '1adb8300-c89d-4ab1-8323-7797a483747c'

describe('order', function () {
  describe('get order', function () {
    it('should return a order object', async () => {

      let order, err

      try {
        order = await ordinalsbot.getOrder(sampleOrderId1);
      } catch (error) {
        err = error;
      }
      finally {
        expect(err).to.be.an('undefined');
        assert.deepEqual(order.id, sampleOrderId1);
      }

    });
  });

  describe('create order', function () {
    it('should return a order object', async () => {

      let order, err

      try {
        order = await ordinalsbot.createOrder({
          files: [
              {
                size: 10,
                type: "plain/text",
                name: "test-my-text-inscription-file.txt",
                dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
              }
          ],
          lowPostage: true,
          receiveAddress: "",
          fee: 10,
          timeout: 1440,
        });
      } catch (error) {
        err = error;
      }
      finally {
        expect(err).to.be.an('undefined');
        assert.deepEqual(order.status, 'ok');
      }
    });
  });

  describe('create order with invalid parameters', function () {
    it('should return a (400) Bad Request', async () => {

      let order, err

      try {
        order = await ordinalsbot.createOrder({
          "description": "hello world"
        });
      } catch (error) {
        assert.deepEqual(error.status, 400);
      }
    });
  });
});

describe('client', function () {
  it('should allow multiple clients with different credentials', async () => {

    let order1, order2, err
    const client1 = new ordinalsbot.OrdinalsBotClient('test1', 'dev');
    const client2 = new ordinalsbot.OrdinalsBotClient('test2', 'dev');

    try {
      order1 = await client1.getOrder(sampleOrderId1);
      order2 = await client2.getOrder(sampleOrderId2);
    } catch (error) {
      err = error;
    }
    finally {
      expect(err).to.be.an('undefined');
      assert.deepEqual(order1.id, sampleOrderId1);
      assert.deepEqual(order2.id, sampleOrderId2);
    }
  });
});
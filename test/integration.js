const { assert, expect } = require('chai');
const { OrdinalsBot } = require('../dist');

// empty credentials should work except for collection-order
const ordinalsbot = new OrdinalsBot('', 'dev');

describe('order', function () {
  describe('get order', function () {
    it('should return a order object', async () => {
      let order, err;

      try {
        order = await ordinalsbot.getOrder(
          '616162ac-6392-4a22-8e7d-3a87cf0c9c28'
        );
      } catch (error) {
        err = error;
      } finally {
        expect(err).to.be.an('undefined');
        assert.deepEqual(
          order.charge.id,
          '616162ac-6392-4a22-8e7d-3a87cf0c9c28'
        );
      }
    });
  });

  describe('create order', function () {
    it('should return a order object', async () => {
      let order, err;

      try {
        order = await ordinalsbot.createOrder({
          files: [
            {
              size: 10,
              type: 'plain/text',
              name: 'test-my-text-inscription-file.txt',
              dataURL: 'data:plain/text;base64,dGVzdCBvcmRlcg==',
            },
          ],
          lowPostage: true,
          receiveAddress: '',
          fee: 10,
          timeout: 1440,
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err).to.be.an('undefined');
        assert.deepEqual(order.status, 'ok');
      }
    });
  });

  describe('create order with invalid parameters', function () {
    it('should return a (400) Bad Request', async () => {
      let order, err;

      try {
        order = await ordinalsbot.createOrder({
          description: 'hello world',
        });
      } catch (error) {
        err = error;
      } finally {
        assert.deepEqual(order.status, 'error');
      }
    });
  });
});

describe('client', function () {
  it('should allow multiple clients with different credentials', async () => {
    let order1, order2, err;
    const client1 = new OrdinalsBot('test1', 'dev');
    const order1Id = '616162ac-6392-4a22-8e7d-3a87cf0c9c28';
    const client2 = new OrdinalsBot('test2', 'dev');
    const order2Id = 'c5fd6dc5-9ed5-453e-96e7-b9b7ca1c6082';

    try {
      order1 = await client1.getOrder(order1Id);
      order2 = await client2.getOrder(order2Id);
    } catch (error) {
      err = error;
    } finally {
      expect(err).to.be.an('undefined');
      assert.deepEqual(order1.charge.id, order1Id);
      assert.deepEqual(order2.charge.id, order2Id);
    }
  });
});

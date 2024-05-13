const { assert, expect } = require("chai");
const sinon = require("sinon");
const { Satscanner } = require("../dist");
const nock = require("nock");
const {PaymentResult, MemoryTokenStore} = require('l402');

describe("Satscanner SDK Tests", function () {
  let sandbox;
  let satscanner;
  let axiosStub;
  const sampleTestNetAddress = "tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6";
  const sampleUtxo = "f8ed8828adf7c780366944c5b8bbe470cdf9212637d09ecd66868fc448bb8967:15"

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    satscanner = new Satscanner("", "dev");
    axiosStub = {
      get: sandbox.stub(satscanner.satscannerInstance.instanceV1, 'get'),
      post: sandbox.stub(satscanner.satscannerInstance.instanceV1, 'post')
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should return supported satributes", async () => {
    const expectedResponse = {
      "result": [
          "uncommon",
          "rare",
          "epic",
          "legendary",
          "mythic",
          "block-9",
          "block-78",
          "block-666",
          "block-999",
          "vintage",
          "number-palindrome",
          "pizza",
          "first-transaction",
          "nakamoto",
          "black"
      ]
    };
    axiosStub.get.resolves({ data: expectedResponse });

    const specialRangesUtxoResponse = await satscanner.getSupportedSatributes();

    sinon.assert.calledWithMatch(axiosStub.get, '/supported-satributes');
    assert.deepEqual(specialRangesUtxoResponse.data, expectedResponse);
  });

  it("should return special ranges for an address", async () => {
    const expectedParams = { address: sampleTestNetAddress };
    const expectedResponse = {
      "result": {
          "inscriptions": [
              {
                  "output": "8622ae5e1d3ea03c3859ea48f8524962abb3512a9342f49d45c3562ed90d418c:0",
                  "inscriptions": [
                      "8622ae5e1d3ea03c3859ea48f8524962abb3512a9342f49d45c3562ed90d418ci0"
                  ]
              }
          ],
          "ranges": [
              {
                  "output": "8622ae5e1d3ea03c3859ea48f8524962abb3512a9342f49d45c3562ed90d418c:0",
                  "start": 1923523562791240,
                  "end": 1923523562791786,
                  "size": 546,
                  "offset": 0,
                  "rarity": "common"
              }
          ],
          "specialRanges": [
              {
                  "start": 1853786874999999,
                  "output": "c0cdb5de99ae10fbe0f8f23afc0937796efef384b81c406072baf42cd671fed4:1",
                  "size": 1,
                  "offset": 0,
                  "satributes": [
                      "black"
                  ]
              }
          ]
      }
    };
    axiosStub.get.resolves({ data: expectedResponse });

    const specialRangesResponse = await satscanner.findSpecialRanges(expectedParams);

    sinon.assert.calledWithMatch(axiosStub.get, '/find-special-ranges', { params: expectedParams });
    assert.deepEqual(specialRangesResponse.data, expectedResponse);
  });

  it("should return special ranges for a utxo", async () => {
    const expectedParams = { utxos: sampleUtxo };
    const expectedResponse = {
      "result": {
          "inscriptions": [
              {
                  "output": "8622ae5e1d3ea03c3859ea48f8524962abb3512a9342f49d45c3562ed90d418c:0",
                  "inscriptions": [
                      "8622ae5e1d3ea03c3859ea48f8524962abb3512a9342f49d45c3562ed90d418ci0"
                  ]
              }
          ],
          "ranges": [
              {
                  "output": "8622ae5e1d3ea03c3859ea48f8524962abb3512a9342f49d45c3562ed90d418c:0",
                  "start": 1923523562791240,
                  "end": 1923523562791786,
                  "size": 546,
                  "offset": 0,
                  "rarity": "common"
              }
          ],
          "specialRanges": [
              {
                  "start": 1853786874999999,
                  "output": "c0cdb5de99ae10fbe0f8f23afc0937796efef384b81c406072baf42cd671fed4:1",
                  "size": 1,
                  "offset": 0,
                  "satributes": [
                      "black"
                  ]
              }
          ]
      }
    };
    axiosStub.post.resolves({ data: expectedResponse });

    const specialRangesUtxoResponse = await satscanner.findSpecialRangesUtxo(expectedParams);

    sinon.assert.calledWithMatch(axiosStub.post, '/find-special-ranges-utxo', { ...expectedParams });
    assert.deepEqual(specialRangesUtxoResponse.data, expectedResponse);
  });
});

// Mock Wallet and Store as they would be used within the Satscanner
class MockWallet  {
  payInvoice(invoice) {
      // Assuming payment is always successful for testing
      return Promise.resolve(new PaymentResult('mock-preimage', true));
  }
}

describe('Satscanner with L402 Handling', () => {
  let satscanner;
  let wallet;
  let store;

  beforeEach(() => {
      wallet = new MockWallet();
      store = new MemoryTokenStore();

      // Initialize Satscanner with L402 enabled
      satscanner = new Satscanner("", "dev", {
          useL402: true,
          l402Config: {
              wallet: wallet,
              tokenStore: store
          }
      });
      
      nock.cleanAll();
  });

  it('should handle L402 Payment Required response by retrying the request', async () => {
      const resourceUrl = "https://ordinalsbot.ln.sulu.sh/satscanner/supported-satributes";
      const invoice = 'mockinvoice';
      
      // First call returns 402 with an invoice challenge
      nock('https://ordinalsbot.ln.sulu.sh')
        .get('/satscanner/supported-satributes')
        .reply(402, '', {
            'WWW-Authenticate': `L402 invoice="${invoice}", macaroon="mockmacaroon"`
        });

      // Second call simulates successful access after payment
      nock('https://ordinalsbot.ln.sulu.sh')
        .get('/satscanner/supported-satributes')
        .reply(200, {data: 'Resource data after L402 handled'});

      const response = await satscanner.getSupportedSatributes();
      expect(response).to.equal('Resource data after L402 handled');
      expect(store.get(resourceUrl)).to.include('mock-preimage');
  });

  it('should store and reuse tokens for subsequent requests', async () => {
      const resourceUrl = 'https://ordinalsbot.ln.sulu.sh/satscanner/supported-satributes';
      store.put(resourceUrl, 'L402 mocktoken');

      nock('https://ordinalsbot.ln.sulu.sh')
          .get('/satscanner/supported-satributes')
          .matchHeader('Authorization', 'L402 mocktoken')
          .reply(200, {"data": "Resource data"});

      const response = await satscanner.getSupportedSatributes();
      expect(response).to.equal('Resource data');
  });
});
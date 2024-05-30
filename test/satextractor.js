const { assert, expect } = require("chai");
const sinon = require("sinon");
const nock = require("nock");
const { PaymentResult, MemoryTokenStore } = require('l402');
const { Satextractor } = require("../dist");

describe("Satextractor SDK Tests", function () {
  let sandbox;
  let satextractor;
  let axiosStub;
  const sampleTestNetAddress = "tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6";
  const sampleUtxo = "f8ed8828adf7c780366944c5b8bbe470cdf9212637d09ecd66868fc448bb8967:15"

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    satextractor = new Satextractor("", "dev");
    axiosStub = {
      get: sandbox.stub(satextractor.satextractorInstance.instanceV1, 'get'),
      post: sandbox.stub(satextractor.satextractorInstance.instanceV1, 'post')
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should return sat extraction raw tx", async () => {
    const expectedParams = {
      "scanAddress": "bc1pshuvzr7x8y3fj362dl2excxx0n69xq42tguxsfrhvmvkre7404gs9cz40h",
      "addressToSendSpecialSats" : "bc1pgnwmg7wplc09cm9fctgmgalu7l4synjh7khwzre9qlcvg5xy0k5qz9mwe3",
      "addressToSendCommonSats": "bc1qq2ealrqzjf6da2l6czkwvtulmkh8m07280kq3q",
      "feePerByte": 30,
      "filterSatributes" : []
    };
    const expectedResponse = {
      "specialRanges": [
          {
              "start": 280810779975733,
              "output": "826fe75c2e9d567baa6bee11160ae265b3007814ecca79299c5bd8338298b5d5:0",
              "size": 1,
              "offset": 0,
              "satributes": [
                  "pizza"
              ]
          }
      ],
      "tx": "0200000001d5b5988233d85b9c2979caec147800b365e20a1611ee6baa7b569d2e5ce76f820000000000fdffffff02220200000000000022512044ddb479c1fe1e5c6ca9c2d1b477fcf7eb024e57f5aee10f2507f0c450c47da85c1100000000000016001402b3df8c029274deabfac0ace62f9fddae7dbfca00000000"
    };
    axiosStub.post.resolves({ data: expectedResponse });

    const extractResponse = await satextractor.extract(expectedParams);

    sinon.assert.calledWithMatch(axiosStub.post, '/extract', { ...expectedParams });
    assert.deepEqual(extractResponse.data, expectedResponse);
  });
});

// Mock classes for Wallet and Store similar to the Satscanner tests
class MockWallet {
  payInvoice(invoice) {
      // Simulate successful payment for testing
      return Promise.resolve(new PaymentResult('mock-preimage', true));
  }
}

describe("Satextractor with L402 Handling", () => {
  let satextractor;
  let wallet;
  let store;

  beforeEach(() => {
    wallet = new MockWallet();
    store = new MemoryTokenStore();

    // Initialize Satextractor with L402 enabled
    satextractor = new Satextractor("", "dev", {
      useL402: true,
      l402Config: {
          wallet: wallet,
          tokenStore: store
      }
    });

    // Clean all nocks before each test
    nock.cleanAll();
  });

  it('should handle L402 Payment Required response by retrying the request', async () => {
    const resourceUrl = "https://ordinalsbot.ln.sulu.sh/satextractor/extract";
    const invoice = 'mockinvoice';
    
    // Simulate a 402 response with invoice details
    nock('https://ordinalsbot.ln.sulu.sh')
      .post('/satextractor/extract')
      .reply(402, '', {
          'WWW-Authenticate': `L402 invoice="${invoice}", macaroon="mockmacaroon"`
      });

    // Simulate successful access after payment
    nock('https://ordinalsbot.ln.sulu.sh')
      .post('/satextractor/extract')
      .reply(200, {data: 'Extraction data after L402 handled'});

    const response = await satextractor.extract({}); // Assuming extract method accepts an object parameter
    expect(response).to.equal('Extraction data after L402 handled');
    expect(store.get(resourceUrl, "POST")).to.include('mock-preimage');
  });

  it('should store and reuse tokens for subsequent requests', async () => {
    const resourceUrl = 'https://ordinalsbot.ln.sulu.sh/satextractor/extract';
    store.put(resourceUrl, 'L402 mocktoken', "POST");

    nock('https://ordinalsbot.ln.sulu.sh')
        .post('/satextractor/extract')
        .matchHeader('Authorization', 'L402 mocktoken')
        .reply(200, {data: "Extracted data"});

    const response = await satextractor.extract({});
    expect(response).to.equal('Extracted data');
  });
});
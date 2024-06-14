const { assert, expect } = require("chai");
const sinon = require("sinon");
const nock = require("nock");
const { Mempool } = require("../dist");
const { PaymentResult, MemoryTokenStore } = require('l402');

describe("Mempool SDK Tests", function () {
  let sandbox;
  let mempool;
  let axiosStub;
  const sampleTestNetAddress = "tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6";

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    mempool = new Mempool("", "testnet");
    axiosStub = {
      get: sandbox.stub(mempool.mempoolInstance.instanceV1, 'get'),
      post: sandbox.stub(mempool.mempoolInstance.instanceV1, 'post')
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should return utxos for an address", async () => {
    const expectedResponse = [
      {
          "txid": "f0d3d66c4e8afbef61ff050f9f2af5a53739e7b486c6f621176b042f5cf80b6e",
          "vout": 0,
          "status": {
              "confirmed": true,
              "block_height": 827418,
              "block_hash": "000000000000000000000a2ab7103ef9d12295b46afadb77c972ec74ca832b05",
              "block_time": 1706243682
          },
          "value": 661306895
      },
      {
          "txid": "398fc49bf87268183cb7c9ceef9e8af391b71017cad399fdeac7d05ee05016e1",
          "vout": 0,
          "status": {
              "confirmed": true,
              "block_height": 822985,
              "block_hash": "00000000000000000000a1b7e37b3e6ec25826a4c7367d32348f3ff47f1bbdaf",
              "block_time": 1703567325
          },
          "value": 747974423
      }
    ];
    axiosStub.get.resolves({ data: expectedResponse });

    const utxoResponse = await mempool.getAddressUtxo(sampleTestNetAddress);

    sinon.assert.calledWithMatch(axiosStub.get, `api/address/${sampleTestNetAddress}/utxo`);
    assert.deepEqual(utxoResponse.data, expectedResponse);
  });
});

// Mock classes for Wallet and Store
class MockWallet {
  payInvoice(invoice) {
      // Simulate successful payment for testing
      return Promise.resolve(new PaymentResult('mock-preimage', true));
  }
}

describe("Mempool with L402 Handling", () => {
  let mempool;
  let wallet;
  let store;

  beforeEach(() => {
    wallet = new MockWallet();
    store = new MemoryTokenStore();

    // Initialize Mempool with L402 enabled
    mempool = new Mempool("", "testnet", {
      useL402: true,
      l402Config: {
          wallet: wallet,
          tokenStore: store
      }
    });

    // Setup nock to clean all interceptors
    nock.cleanAll();
  });

  it('should handle L402 Payment Required response by retrying the request', async () => {
    const resourceUrl = "https://ordinalsbot.ln.sulu.sh/mempool/api/address/tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6/utxo";
    const invoice = 'mockinvoice';
    
    // Simulate a 402 response with invoice details
    nock('https://ordinalsbot.ln.sulu.sh')
      .get('/mempool/api/address/tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6/utxo')
      .reply(402, '', {
          'WWW-Authenticate': `L402 invoice="${invoice}", macaroon="mockmacaroon"`
      });

    // Simulate successful access after payment
    nock('https://ordinalsbot.ln.sulu.sh')
      .get('/mempool/api/address/tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6/utxo')
      .reply(200, {data: 'UTXO data after L402 handled'});

    const response = await mempool.getAddressUtxo('tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6');
    expect(response).to.equal('UTXO data after L402 handled');
    expect(store.get(resourceUrl)).to.include('mock-preimage');
  });

  it('should store and reuse tokens for subsequent requests', async () => {
    const resourceUrl = 'https://ordinalsbot.ln.sulu.sh/mempool/api/address/tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6/utxo';
    store.put(resourceUrl, 'L402 mocktoken');

    nock('https://ordinalsbot.ln.sulu.sh')
        .get('/mempool/api/address/tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6/utxo')
        .matchHeader('Authorization', 'L402 mocktoken')
        .reply(200, {data: "UTXO data"});

    const response = await mempool.getAddressUtxo('tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6');
    expect(response).to.equal('UTXO data');
  });
});
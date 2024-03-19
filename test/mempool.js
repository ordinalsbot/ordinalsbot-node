const { assert, expect } = require("chai");
const sinon = require("sinon");
const { Mempool } = require("../dist");

describe("Mempool SDK Tests", function () {
  let sandbox;
  let mempool;
  let axiosStub;
  const sampleTestNetAddress = "tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6";

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    mempool = new Mempool("", "dev");
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
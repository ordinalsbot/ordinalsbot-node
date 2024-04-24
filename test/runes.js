const { assert, expect } = require("chai");
const sinon = require("sinon");
const { Inscription } = require("../dist");
const { v4: uuidv4 } = require("uuid");

describe("Runes SDK Tests", function () {
  let sandbox;
  let inscription;
  let axiosStub;
  const sampleOrderId1 = uuidv4();
  const sampleOrderId2 = uuidv4();
  const sampleTestNetAddress = "tb1qw2c3lxufxqe2x9s4rdzh65tpf4d7fssjgh8nv6";

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    inscription = new Inscription("", "dev");
    axiosStub = {
      get: sandbox.stub(inscription.instance.axiosInstance, 'get'),
      post: sandbox.stub(inscription.instance.axiosInstance, 'post')
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should return a rune etching order object with status 'ok' and verify payload", async () => {
    const orderPayload = {
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
      fee: 110,
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
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createRunesEtchOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/runes/etch', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });

  it("should throw a (400) Bad Request when creating a rune etching order with invalid parameters", async () => {
    axiosStub.post.rejects({
      response: {
        status: 400,
        data: 'Bad Request'
      }
    });

    let error;

    try {
      await inscription.createRunesEtchOrder({ description: "hello world" });
    } catch (e) {
      error = e;
    }

    assert.isDefined(error);
    assert.strictEqual(error.response.status, 400);
    assert.strictEqual(error.response.data, 'Bad Request');
    sinon.assert.calledOnce(axiosStub.post);
  });
});
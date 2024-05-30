const { assert, expect } = require("chai");
const sinon = require("sinon");
const { Inscription } = require("../dist");
const { v4: uuidv4 } = require("uuid");

describe("Inscription SDK Tests", function () {
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

  it("should return a price for an order", async () => {
    const expectedParams = { size: 150, fee: 2 };
    axiosStub.get.resolves({ data: { postage: 10000 } });

    const priceResponse = await inscription.getPrice(expectedParams);

    sinon.assert.calledWithMatch(axiosStub.get, '/price', { params: expectedParams });
    assert.deepEqual(priceResponse.data, { postage: 10000 });
  });

  it("should return an order object with status 'ok' and verify payload", async () => {
    const orderPayload = {
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
    };
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/order', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });

  it("should create an order with delegates", async () => {
    const orderPayload = {
      delegates: [
        {
          delegateId: '552448ac8b668f2b8610a4c9aa1d82dbcc3cb1b28139ad99309563aad4f1b0c1i0'
        },
      ],
      lowPostage: true,
      receiveAddress: "",
      fee: 10,
      timeout: 1440,
    };
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/order', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });

  it("should create an order with brotli compression", async () => {
    const orderPayload = {
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
      compress: true,
    };
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/order', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });

  it("should create an order with metadata json", async () => {
    const orderPayload = {
      files: [
        {
          type: "plain/text",
          name: "test-my-text-inscription-file.txt",
          dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
          size: 10,
          metadataDataURL: "data:text/plain;base64,ewogICAgaW5zY3JpYmVkX2J5OiAiT3JkaW5hbHNCb3QiCn0=",
          metadataSize: 35
        },
      ],
      lowPostage: true,
      receiveAddress: "",
      fee: 10,
      timeout: 1440,
    };
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/order', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });

  it("should create an order with metaprotocol field", async () => {
    const orderPayload = {
      files: [
        {
          type: "plain/text",
          name: "test-my-text-inscription-file.txt",
          dataURL: "data:plain/text;base64,dGVzdCBvcmRlcg==",
          size: 10,
          metaprotocol: "some-protocol"
        },
      ],
      lowPostage: true,
      receiveAddress: "",
      fee: 10,
      timeout: 1440,
    };
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/order', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });

  it("should return an order object when getting an order", async () => {
    axiosStub.get.resolves({ data: { id: sampleOrderId1 } });

    const order = await inscription.getOrder(sampleOrderId1);

    sinon.assert.calledWithExactly(axiosStub.get, `/order`, { params: { id: sampleOrderId1 } });
    assert.deepEqual(order.data, { id: sampleOrderId1 });
  });

  it("should throw a (400) Bad Request when creating an order with invalid parameters", async () => {
    axiosStub.post.rejects({
      response: {
        status: 400,
        data: 'Bad Request'
      }
    });

    let error;

    try {
      await inscription.createOrder({ description: "hello world" });
    } catch (e) {
      error = e;
    }

    assert.isDefined(error);
    assert.strictEqual(error.response.status, 400);
    assert.strictEqual(error.response.data, 'Bad Request');
    sinon.assert.calledOnce(axiosStub.post);
  });

describe("create collection", function () {
  it("should return a collection object", async () => {
    const collection = {
      id: uuidv4(),
      name: "collection name",
      description: "test description",
      creator: "creator",
      price: 100,
      totalCount: "50",
      files: [{ name: "test.txt", url: "https://example.com", size: 50 }],
    }

    axiosStub.post.resolves({ status: 200, data: collection });
    
    try {
      const createCollectionResponse = await inscription.createCollection(collection);

      // Verify response
      assert.strictEqual(createCollectionResponse.status, 200);
      assert.isNotNull(createCollectionResponse.data.id);
      assert.strictEqual(createCollectionResponse.data.name, "collection name");
    } catch (e) {
      error = e;
    }
  });
});

describe("create text inscription order", function () {
  it("should return text inscription order", async () => {
    axiosStub.post.resolves({ data: { id: uuidv4() } });

    const order = await inscription.createTextOrder({
      texts: ["text inscription 1", "text inscription 2"],
      fee: 10,
      receiveAddress: sampleTestNetAddress,
      lowPostage: false,
    });

    assert.isNotNull(order.data.id);
  });
});

  it("should save and get referral code", async () => {
    const sampleReferralId = uuidv4();
    axiosStub.post.withArgs('/referrals').resolves({ data: { status: "ok" } });
    axiosStub.get.withArgs('/referrals').resolves({ data: { address: sampleTestNetAddress } });

    const setResponse = await inscription.setReferralCode({
      referral: sampleReferralId,
      address: sampleTestNetAddress,
    });

    const getResponse = await inscription.getReferralStatus({
      referral: sampleReferralId,
      address: sampleTestNetAddress,
    });

    sinon.assert.calledWith(axiosStub.post, '/referrals', {
      referral: sampleReferralId,
      address: sampleTestNetAddress,
    });
    sinon.assert.calledWith(axiosStub.get, '/referrals', {
      params: {
        referral: sampleReferralId,
        address: sampleTestNetAddress,
      }
    });
    assert.deepEqual(setResponse.data.status, "ok");
    assert.equal(getResponse.data.address, sampleTestNetAddress);
  });

  describe("Inventory", function () {
    it("check rare sats inventory", async () => {
      axiosStub.get.resolves({ data: { inventory: [] } });
  
      const response = await inscription.getInventory();
  
      assert.isArray(response.data.inventory);
    });
  });
  it("should allow multiple clients with different credentials", async () => {
    const client1 = new Inscription("test1", "dev");
    const client2 = new Inscription("test2", "dev");
    const axiosGetStub1 = sandbox.stub(client1.instance.axiosInstance, 'get').resolves({ data: { id: sampleOrderId1 } });
    const axiosGetStub2 = sandbox.stub(client2.instance.axiosInstance, 'get').resolves({ data: { id: sampleOrderId2 } });

    const order1 = await client1.getOrder(sampleOrderId1);
    const order2 = await client2.getOrder(sampleOrderId2);

    assert.deepEqual(order1.data.id, sampleOrderId1);
    assert.deepEqual(order2.data.id, sampleOrderId2);
    sinon.assert.calledWithExactly(axiosGetStub1, `/order`, { params: { id: sampleOrderId1 } });
    sinon.assert.calledWithExactly(axiosGetStub2, `/order`, { params: { id: sampleOrderId2 } });
  });

  it("should create a direct inscription order object with status 'ok' and verify payload", async () => {
    const orderPayload = {
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
    };
    axiosStub.post.resolves({ data: { status: "ok" } });

    const orderResponse = await inscription.createDirectOrder(orderPayload);

    sinon.assert.calledWithMatch(axiosStub.post, '/inscribe', orderPayload);
    assert.deepEqual(orderResponse.data, { status: "ok" });
  });
});

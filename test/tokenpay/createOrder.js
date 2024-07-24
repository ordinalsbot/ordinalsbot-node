const { expect } = require("chai");
const sinon = require("sinon");
const { TokenPay } = require("../../dist/tokenpay/index");
const { TokenPayClient } = require("../../dist/tokenpay/client");

describe("Create Order", function () {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a new order", async () => {
    const inputRequest = {
      amount: 2000,
      token: "rune",
      accountId: "customer_123",
    };

    const mockOrderResponse = {
      id: "someOrderID",
      createdAt: 1719554214939,
      accountId: "someAccountId",
      feeCharge: {
        amount: 1000,
        token: "usd",
        address: "abc",
        state: "pending_payment",
        tokenType: "btc",
        protocol: "bitcoin",
        txid: null,
        createdAt: 1721384941957,
      },
      tokenCharge: {
        amount: 2000,
        token: "rune",
        address: "def",
        state: "pending_payment",
        tokenType: "rune",
        protocol: "bitcoin",
        txid: null,
        createdAt: 1721384941957,
      },
      webhookUrl: null,
      type: "rune",
      state: "pending",
    };

    sinon.stub(TokenPayClient.prototype, "createRuneOrder").resolves(mockOrderResponse);
    const tokenPay = new TokenPay("someApiKey", "testnet");
    const response = await tokenPay.createRuneOrder(inputRequest);
    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockOrderResponse);
    expect(TokenPayClient.prototype.createRuneOrder.calledOnce).to.be.true;
    sinon.restore();
  });
});

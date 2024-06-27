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
      },
      tokenCharge: {
        amount: 2000,
        token: "rune",
        address: "def",
        state: "pending_payment",
        tokenType: "rune",
      },
      type: "rune",
      state: "pending",
    };

    sinon.stub(TokenPayClient.prototype, "createOrder").resolves(mockOrderResponse);
    const tokenPay = new TokenPay("someApiKey", "testnet");
    const response = await tokenPay.createOrder(inputRequest);
    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockOrderResponse);
    expect(TokenPayClient.prototype.createOrder.calledOnce).to.be.true;
    sinon.restore();
  });
});

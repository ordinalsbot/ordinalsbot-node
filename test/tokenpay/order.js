const { expect } = require("chai");
const sinon = require("sinon");
const { TokenPay } = require("../../dist/tokenpay/index");
const { TokenPayClient } = require("../../dist/tokenpay/client");

describe("Order", function () {
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

  it("should returns an order details with valid order id", async () => {
    const inputRequest = {
      orderId: 'someOrderId',
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

    sinon.stub(TokenPayClient.prototype, "getOrder").resolves(mockOrderResponse);
    const tokenPay = new TokenPay("someApiKey", "testnet");
    const response = await tokenPay.getOrder(inputRequest);
    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockOrderResponse);
    expect(TokenPayClient.prototype.getOrder.calledOnce).to.be.true;
    sinon.restore();
  });

  it("should return error for bad request", async () => {
    sinon.stub(TokenPayClient.prototype, "getOrder").rejects({
      response: {
        status: 404,
        data: {
          error: [
            {
              msg: "Order not found"
            }
          ]
        }
      }
    });

    try {
      const inputRequest = {
        orderId: 'invalidOrderId',
      };
      const tokenPay = new TokenPay("someApiKey", "testnet");
      await tokenPay.getOrder(inputRequest);
    } catch (error) {
      // Assuming your error handling converts the 404 error to a 400 error
      expect(error.response.status).to.equal(404);
      expect(error.response.data.error[0].msg).to.equal("Order not found");
    }
    sinon.restore();
  });
});

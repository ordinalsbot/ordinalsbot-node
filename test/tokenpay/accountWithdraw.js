const { expect } = require("chai");
const sinon = require("sinon");
const { TokenPay } = require("../../dist/tokenpay/index");
const { TokenPayClient } = require("../../dist/tokenpay/client");

describe("Account Withdraw", function () {
  afterEach(() => {
    sinon.restore();
  });

  it("should create user account withdraw request", async () => {
    const inputRequest = {
      protocol: "rune",
      token: "SHITCOIN",
      amount: 1000,
      address: "2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL",
    };

    const mockWithdraw = {
      id: "673dc808-98e0-49bc-bb83-e535c611ce2b",
      createdAt: 1721892881114,
      accountId: "local-test-id",
      protocol: "rune",
      token: "SHITCOIN",
      amount: 1000,
      address: "2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL",
      state: "pending",
      txid: null,
      chainFee: null,
      tries: 0,
      processingAt: null,
      feePerByte: null,
    };

    sinon.stub(TokenPayClient.prototype, "accountWithdraw").resolves(mockWithdraw);
    const tokenPay = new TokenPay("someApiKey", "testnet", {}, "someTokenPayApiKey");
    const response = await tokenPay.accountWithdraw(inputRequest);
    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockWithdraw);
    expect(TokenPayClient.prototype.accountWithdraw.calledOnce).to.be.true;
    sinon.restore();
  });

  it("should return an error for insufficient balance when creating the user account withdrawal", async () => {
    const inputRequest = {
      protocol: "rune",
      token: "SHITCOIN",
      amount: 1000,
      address: "2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL",
    };

    const mockWithdraw = {
      success: false,
      message: "user does not have a balance for this token",
    };

    sinon.stub(TokenPayClient.prototype, "accountWithdraw").resolves(mockWithdraw);
    const tokenPay = new TokenPay("someApiKey", "testnet", {}, "someTokenPayApiKey");
    const response = await tokenPay.accountWithdraw(inputRequest);
    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockWithdraw);
    expect(TokenPayClient.prototype.accountWithdraw.calledOnce).to.be.true;
    sinon.restore();
  });

  it("should return a account withdrawal details by withdrawalId", async () => {
    const inputRequest = {
      withdrawalId: "someWithdrawalId"
    };

    const mockWithdraw = {
      id: "673dc808-98e0-49bc-bb83-e535c611ce2b",
      createdAt: 1721892881114,
      accountId: "local-test-id",
      protocol: "rune",
      token: "SHITCOIN",
      amount: 1000,
      address: "2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL",
      state: "pending",
      txid: null,
      chainFee: null,
      tries: 0,
      processingAt: null,
      feePerByte: null,
    };

    sinon.stub(TokenPayClient.prototype, "getAccountWithdraw").resolves(mockWithdraw);
    const tokenPay = new TokenPay("someApiKey", "testnet", {}, "someTokenPayApiKey");
    const response = await tokenPay.getAccountWithdraw(inputRequest);
    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockWithdraw);
    expect(TokenPayClient.prototype.getAccountWithdraw.calledOnce).to.be.true;
    sinon.restore();
  });

  it("should return an error for an invalid withdrawal request by ID.", async () => {
    sinon.stub(TokenPayClient.prototype, "getAccountWithdraw").rejects({
      response: {
        status: 404,
        data: {
          error: [
            {
              msg: "withdrawal not found",
            },
          ],
        },
      },
    });

    try {
      const inputRequest = {
        orderId: 'invalidOrderId',
      };
      const tokenPay = new TokenPay("someApiKey", "testnet", {}, "someTokenPayApiKey");
      await tokenPay.getAccountWithdraw(inputRequest);
    } catch (error) {
      // Assuming your error handling converts the 404 error to a 400 error
      expect(error.response.status).to.equal(404);
      expect(error.response.data.error[0].msg).to.equal("withdrawal not found");
    }
    sinon.restore();
  });
});

const { expect } = require("chai");
const sinon = require("sinon");
const { TokenPay } = require("../../dist/tokenpay/index");
const { TokenPayClient } = require("../../dist/tokenpay/client");

describe("Create Payment PSBT", function () {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a PSBT for order without wallet provider", async () => {
    const inputRequest = {
      orderId: "someOrderID",
      paymentAddress: "somePaymentAddress",
      paymentPublicKey: "somePaymentPublicKey",
      feeRate: 28,
    };

    const mockResponse = {
      psbtBase64: "somePsbtBase64String",
      inputIndicesToSign: [0,1,2],
      psbtHex: "somePSBTHexString",
    };

    sinon
      .stub(TokenPayClient.prototype, "createPaymentPSBT")
      .resolves(mockResponse);

    const tokenPay = new TokenPay("someApiKey", "testnet");
    const response = await tokenPay.createPaymentPSBT(inputRequest);

    expect(response).to.be.a("object");
    expect(response).to.deep.equal(mockResponse);
    expect(TokenPayClient.prototype.createPaymentPSBT.calledOnce).to.be.true;
    sinon.restore();
  });

  it("should return PSBT for order with wallet provider", async () => {
    
    const inputRequest = {
      orderId: "someOrderID",
      paymentAddress: "somePaymentAddress",
      paymentPublicKey: "somePaymentPublicKey",
      feeRate: 28,
      walletProvider: "Xverse",
    };

    const mockResponse = {
      psbtBase64: "somePsbtBase64String",
      inputIndicesToSign: [0,1,2],
      psbtHex: "somePSBTHexString",
    };

    sinon
      .stub(TokenPayClient.prototype, "createPaymentPSBT")
      .resolves(mockResponse);

    sinon.stub(TokenPay.prototype, "satsConnectWrapper").resolves({
      success: true,
      message: "Transaction successfull",
      psbtBase64: "someString",
      txId: "someTransactionID",
    });

    const tokenPay = new TokenPay("someApiKey", "testnet");
    const response = await tokenPay.createPaymentPSBT(inputRequest);
    
    expect(response.txId).to.be.a("string");
    expect(response.psbtBase64).to.be.a("string");
    expect(TokenPayClient.prototype.createPaymentPSBT.calledOnce).to.be.true;
    expect(TokenPay.prototype.satsConnectWrapper.calledOnce).to.be.true;
    sinon.restore();
  });
});

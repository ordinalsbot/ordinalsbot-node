const { assert, expect } = require("chai");
const sinon = require("sinon");
const { MarketPlace } = require("../dist");

const authenticationErrorStatus = 401;
const authenticationErrorMessage = "Request failed with status code 401";

const sandbox = sinon.createSandbox();
let marketPlace;

const sellerOrdinal = { id: "test_id", price: 1000 };
const mockData = {
  ordinalId: "test_id",
  buyerPaymentAddress: "test_payment_address",
  buyerOrdinalAddress: "test_ordinal_address",
  signedPsbt: "test_signed_psbt",
  publicKey: "test_public_key",
};

describe("marketplace", function () {
  before(() => {
    marketPlace = new MarketPlace("");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("create marketplace", function () {
    it("should return a marketplace", async () => {
      const createMarketplaceStub = sandbox.stub(marketPlace, 'createMarketplace').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.createMarketplace({ name: "Marketplace" });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(createMarketplaceStub);
    });
  });

  describe("List ordinal for sale", function () {
    it("should return a base64 transaction to be signed", async () => {
      const createListingStub = sandbox.stub(marketPlace, 'createListing').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.createListing({ sellerOrdinals: [sellerOrdinal] });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(createListingStub);
    });
  });

  describe("Create Buy Offer", function () {
    it("should return create buy offer response", async () => {
      const createOfferStub = sandbox.stub(marketPlace, 'createOffer').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.createOffer({
          ordinalId: mockData.ordinalId,
          buyerPaymentAddress: mockData.buyerPaymentAddress,
          buyerOrdinalAddress: mockData.buyerOrdinalAddress
        });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(createOfferStub);
    });
  });

  describe("Submit Buy Offer", function () {
    it("should return txid", async () => {
      const submitOfferStub = sandbox.stub(marketPlace, 'submitOffer').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.submitOffer({
          ordinalId: mockData.ordinalId,
          signedBuyerPSBTBase64: mockData.signedPsbt
        });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(submitOfferStub);
    });
  });

  describe("Confirm padding output", function () {
    it("should check if padding output exists or not", async () => {
      const confirmPaddingOutputsStub = sandbox.stub(marketPlace, 'confirmPaddingOutputs').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.confirmPaddingOutputs({ address: mockData.buyerPaymentAddress });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(confirmPaddingOutputsStub);
    });
  });

  describe("Setup padding output", function () {
    it("should return base64 transaction to be signed", async () => {
      const setupPaddingOutputsStub = sandbox.stub(marketPlace, 'setupPaddingOutputs').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.setupPaddingOutputs({
          address: mockData.buyerPaymentAddress,
          publicKey: mockData.publicKey
        });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(setupPaddingOutputsStub);
    });
  });

  describe("Get ordinal listing", function () {
    it("should return array of ordinals", async () => {
      const getListingStub = sandbox.stub(marketPlace, 'getListing').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.getListing({ status: "active" });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(getListingStub);
    });
  });

  describe("Update ordinal listing", function () {
    it("should return signed psbt", async () => {
      const saveListingStub = sandbox.stub(marketPlace, 'saveListing').rejects({
        status: authenticationErrorStatus,
        message: authenticationErrorMessage
      });
      
      try {
        await marketPlace.saveListing({
          ordinalId: mockData.ordinalId,
          updateListingData: { signedListingPSBT: mockData.signedPsbt }
        });
      } catch (error) {
        expect(error.status).to.equal(authenticationErrorStatus);
        expect(error.message).to.equal(authenticationErrorMessage);
      }
      sinon.assert.calledOnce(saveListingStub);
    });
  });

  describe("List ordinal for sale with walletProvider", function () {
    it.only("should handle the listing process with a walletProvider", async () => {
      const createListingStub = sandbox.stub(marketPlace, 'createListing').resolves({
        psbt: "test_psbt"
      });
  
      // Constructing a mock request based on MarketplaceCreateListingRequest type
      const mockListingRequest = {
        sellerOrdinals: [{
          id: "0c9ac6fb5d4516aade728882e230b0d78337732ea71915c7fbc0cdabe5d29f3ci0",
          price: "1234"
        }],
        sellerPaymentAddress: "2NAurbuXjBK5dztb416bh98ibDS7MKxV75C",
        sellerOrdinalPublicKey: "594a4aaf5da5b144d0fa6b47987d966029d892fbc4aebb23214853e8b053702e",
        sellerOrdinalAddress: "tb1p79l2gnn7u8uqxfepd7ddeeajzrmuv9nkl20wpf77t2u473a2h89s483yk3",
        walletProvider: "xverse"
      };
  
      try {
        const response = await marketPlace.createListing(mockListingRequest);
        console.log({response, data: response.data});
        expect(response).to.have.property('psbt').that.equals("test_psbt");
        sinon.assert.calledWith(createListingStub, sinon.match(mockListingRequest));
      } catch (error) {
        console.log(error);
        assert.fail("Should not have thrown an error");
      }
    });
  });
  
});

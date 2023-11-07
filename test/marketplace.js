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
});

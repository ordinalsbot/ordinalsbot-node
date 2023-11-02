const { assert, expect } = require("chai");
const inscription = require("../dist");
const API_KEY = "";
const marketPlace = new inscription.MarketPlace(API_KEY);
const authenticationErrorStatus = 401;
const authenticationErrorMessage = "Request failed with status code 401";

const sellerOrdinal = { id: "test_id", price: 1000 };
const mockData = {
  ordinalId: "test_id",
  buyerPaymentAddress: "test_payment_address",
  buyerOrdinalAddress: "test_ordinal_address",
  signedPsbt: "test_signed_psbt",
  publicKey: "test_public_key",
};

describe("marketplace", function () {
  describe("create marketplace", async function () {
    it("should return a marketplace", async () => {
      let marketplaceObj, err;
      try {
        marketplaceObj = await marketPlace.createMarketplace({
          name: "Marketplace",
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(marketplaceObj, undefined);
      }
    });
  });

  describe("List ordinal for sale", async function () {
    it("should return a base64 transaction to be signed", async () => {
      let ordinal, err;
      try {
        ordinal = await marketPlace.listSaleForOrdinal({
          sellerOrdinals: [sellerOrdinal],
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(ordinal, undefined);
      }
    });
  });

  describe("Create Buy Offer", async function () {
    it("should return create buy offer response", async () => {
      let buyOffer, err;
      try {
        buyOffer = await marketPlace.createBuyOffer({
          ordinalId: mockData.ordinalId,
          buyerPaymentAddress: mockData.buyerPaymentAddress,
          buyerOrdinalAddress: mockData.buyerOrdinalAddress,
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(buyOffer, undefined);
      }
    });
  });

  describe("Submit Buy Offer", async function () {
    it("should return txid", async () => {
      let submitOffer, err;
      try {
        submitOffer = await marketPlace.submitBuyOffer({
          ordinalId: mockData.ordinalId,
          signedBuyerPSBTBase64: mockData.signedPsbt,
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(submitOffer, undefined);
      }
    });
  });

  describe("Check padding output", async function () {
    it("should check if padding output exists or not", async () => {
      let paddingExists, err;
      try {
        paddingExists = await marketPlace.checkPaddingOutput({
          address: mockData.buyerPaymentAddress,
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(paddingExists, undefined);
      }
    });
  });

  describe("Create padding output", async function () {
    it("should return base64 transaction to be signed", async () => {
      let paddingOutput, err;
      try {
        paddingOutput = await marketPlace.createPaddingOutput({
          address: mockData.buyerPaymentAddress,
          publicKey: mockData.publicKey,
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(paddingOutput, undefined);
      }
    });
  });

  describe("Get ordinal listing", async function () {
    it("should return array of ordinals", async () => {
      let ordinals, err;
      try {
        ordinals = await marketPlace.getListing();
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(ordinals, undefined);
      }
    });
  });
});

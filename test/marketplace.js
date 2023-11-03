const { assert, expect } = require("chai");
const ordinalsbot = require("../dist");

const marketPlace = new ordinalsbot.MarketPlace("");
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
    it("should return a markplace", async () => {
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
        ordinal = await marketPlace.createListing({
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
        buyOffer = await marketPlace.createOffer({
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
        submitOffer = await marketPlace.submitOffer({
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

  describe("Confirm padding output", async function () {
    it("should check if padding output exists or not", async () => {
      let paddingExists, err;
      try {
        paddingExists = await marketPlace.confirmPaddingOutputs({
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

  describe("Setup padding output", async function () {
    it("should return base64 transaction to be signed", async () => {
      let paddingOutput, err;
      try {
        paddingOutput = await marketPlace.setupPaddingOutputs({
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
        ordinals = await marketPlace.getListing({
          status: "active",
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(ordinals, undefined);
      }
    });
  });

  describe("Update ordinal listing", async function () {
    it("should return signed psbt", async () => {
      let psbt, err;
      try {
        psbt = await marketPlace.saveListing({
          ordinalId: mockData.ordinalId,
          updateListingData: { signedListingPSBT: mockData.signedPsbt },
        });
      } catch (error) {
        err = error;
      } finally {
        expect(err.status).to.be.equal(authenticationErrorStatus);
        expect(err.message).to.be.equal(authenticationErrorMessage);
        assert.deepEqual(psbt, undefined);
      }
    });
  });
});

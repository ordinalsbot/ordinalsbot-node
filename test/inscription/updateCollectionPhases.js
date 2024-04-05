const { expect } = require("chai");
const sinon = require("sinon");
const { Inscription, InscriptionClient } = require("../../dist");

const sandbox = sinon.createSandbox();
describe("Update Collection Phases", function () {
  afterEach(() => {
    sandbox.restore();
  });

  it("should return psbt for special sats", async () => {
    const collectionRequest = {
      id: "existingCollectionID",
      name: "collection name",
      description: "test description",
      creator: "creator",
      price: 100,
      totalCount: "50",
      files: [{ name: "test.txt", url: "https://example.com", size: 50 }],
      phases: [
        {
          inscriptionsCount: 10,
          allowList: {
            address1: {
              allocation: 10,
            },
            address2: {
              allocation: -1,
            },
          },
          isPublic: 0,
          price: 6000,
          startDate: "2024-04-14 18:12:00",
          endDate: "2024-04-20 18:12:00",
        },
        {
          inscriptionsCount: 20,
          isPublic: 1,
          price: 8000,
          startDate: "2024-04-22 18:12:00",
          endDate: "2024-04-30 18:12:00",
        },
      ],
    };

    const mockResponse = {
      creator: "test creator",
      id: "existingCollectionID",
      serviceFee: 9000,
      fee: 0,
      totalCount: 1,
      averageSize: 2862,
      status: "minting",
      preinscribedCount: 0,
      inscribedCount: 0,
      paidItemCount: 0,
      allowList: false,
      phases: true,
      "creator-address": null,
      twitter: null,
      website: null,
      banner: null,
      cover: null,
      parent: null,
      description: "test collection",
      name: "collection_1",
      price: 1122,
      active: false,
      createdAt: {
        ".sv": "timestamp",
      },
    };

    sinon
      .stub(InscriptionClient.prototype, "updateCollectionPhases")
      .callsFake(() => mockResponse);

    const inscription = new Inscription("someApiKey", "dev");
    const response = await inscription.updateCollectionPhases(
      collectionRequest
    );

    expect(response).to.equal(mockResponse);
    expect(InscriptionClient.prototype.updateCollectionPhases.calledOnce).to.be
      .true;
  });
});

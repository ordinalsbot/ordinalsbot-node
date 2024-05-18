const { expect } = require("chai");
const sinon = require("sinon");
const { Inscription, InscriptionClient } = require("../../dist");

describe("Get Allocation", function () {
  afterEach(() => {
    sinon.restore();
  });

  it("should return phases for receiveAddress with allocation and inscribedCount", async () => {
    const getAllocationRequest = {
      id: "someCollectionId",
      receiveAddress: "someReceiveAddress",
    };

    const mockResponse = {
      phases: [
        {
          phaseId: "0b553157-dba9-40b0-badd-d4274eda7b45",
          public: 0,
          allocation: 1,
          inscribedCount: 0,
          paidItemCount: 0
        },
        {
          phaseId: "13a5b8b1-ba0d-4ef6-b2c8-0e6348f5dfc4",
          public: 0,
          allocation: 4,
          inscribedCount: 0,
          paidItemCount: 0
        },
        {
          phaseId: "d859e70a-a4e5-4073-809f-686c0a9b69ef",
          public: 0,
          allocation: 4,
          inscribedCount: 0,
          paidItemCount: 0
        },
      ],
    };

    sinon
      .stub(InscriptionClient.prototype, "getAllocation")
      .callsFake(() => mockResponse);

    const inscription = new Inscription("someApiKey", "dev");
    const response = await inscription.getAllocation(getAllocationRequest);

    expect(response).to.equal(mockResponse);
    expect(response.phases).to.be.a("array");
    expect(InscriptionClient.prototype.getAllocation.calledOnce).to.be.true;
    sinon.restore();
  });

  it("should return error for bad request", async () => {
    sinon.stub(InscriptionClient.prototype, "getAllocation").rejects({
      status: 400,
      message: "Bad Request",
    });
    const getAllocationRequest = {
      id: "someOtherCollectionId",
      receiveAddress: "someInvalidReceiveAddress",
    };
    try {
      const inscription = new Inscription("someApiKey", "dev");
      await inscription.getAllocation(getAllocationRequest);
    } catch (error) {
      expect(error.status).to.equal(400);
      expect(error.message).to.equal("Bad Request");
    }
    sinon.restore();
  });
});

const { expect } = require("chai");
const sinon = require("sinon");
const { Opi } = require("../dist/opi/index");
const { OpiClient } = require("../dist/opi/client");

const sandbox = sinon.createSandbox();
describe("Opi Proxy", function () {
  afterEach(() => {
    sandbox.restore();
  });

  it("should return block height", async () => {
    sinon.stub(OpiClient.prototype, "blockHeight").callsFake(() => 838346);

    const opi = new Opi("someApiKey", "dev");
    const response = await opi.blockHeight();

    expect(response).to.be.a("number");
    expect(OpiClient.prototype.blockHeight.calledOnce).to.be.true;
  });
});

const { assert, expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { MarketPlaceClient } = require('../../dist/marketplace_client')

const sandbox = sinon.createSandbox()
describe('Marketplace Confirm ReListing', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should return success message', async () => {
    const confirmReListingRequest = {
      ordinalId: 'someOrdinalId',
      signedListingPSBT: 'someSignedPSBTString',
    }
    const mockResponse = {
      message: 'Signed PSBT is updated successfully',
    }

    sinon
      .stub(MarketPlaceClient.prototype, 'confirmReListing')
      .callsFake(() => mockResponse)

    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const response = await marketPlace.confirmReListing(confirmReListingRequest)

    expect(response).to.equal(mockResponse)
    expect(response.message).to.be.a('string')
    expect(MarketPlaceClient.prototype.confirmReListing.calledOnce).to.be.true
  })
})

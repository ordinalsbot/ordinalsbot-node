const { assert, expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { MarketPlaceClient } = require('../../dist/marketplace_client')

const sandbox = sinon.createSandbox()
describe('Marketplace Confirm Listing', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should return success message', async () => {
    
    const sellerOrdinals = ['someOrdinalId1', 'someOrdinalId2']
    const confirmListingRequest = {
      sellerOrdinals: sellerOrdinals,
      signedListingPSBT: 'someSignedPSBTString',
    }
    const mockResponse = {
      message: 'Signed PSBT is updated successfully',
    }
    
    sinon
      .stub(MarketPlaceClient.prototype, 'confirmListing')
      .callsFake(() => mockResponse)
    
    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const response = await marketPlace.confirmListing(confirmListingRequest)
    
    expect(response).to.equal(mockResponse)
    expect(response.message).to.be.a('string')
    expect(MarketPlaceClient.prototype.confirmListing.calledOnce).to.be.true
  })
})

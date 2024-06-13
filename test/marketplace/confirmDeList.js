const { expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { MarketPlaceClient } = require('../../dist/marketplaceClient')

const sandbox = sinon.createSandbox()
describe('Marketplace Confirm DeListing', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should return success message', async () => {
    const confirmDeListingRequest = {
      ordinalId: 'someOrdinalId',
      sellerPaymentAddress: 'someSellerPaymentAddress',
    }
    const mockResponse = {
      message: 'Ordinal successfully delisted',
    }

    sinon
      .stub(MarketPlaceClient.prototype, 'confirmDeListing')
      .callsFake(() => mockResponse)

    const marketPlace = new MarketPlace('someApiKey', 'testnet')
    const response = await marketPlace.confirmDeListing(confirmDeListingRequest)

    expect(response).to.equal(mockResponse)
    expect(response.message).to.be.a('string')
    expect(MarketPlaceClient.prototype.confirmDeListing.calledOnce).to.be.true
  })
})

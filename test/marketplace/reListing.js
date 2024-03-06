const { assert, expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { WALLET_PROVIDER } = require('../../dist/types/marketplace_types')

const sandbox = sinon.createSandbox()
describe('List ordinal for sale with walletProvider', function () {
  it('should handle the listing process with a walletProvider', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const createListingStub = sandbox.stub(marketPlace, 'reListing').resolves({
      psbt: 'test_psbt',
    })

    // Constructing a mock request based on MarketplaceReListingRequest type
    const mockListingRequest = {
      ordinalId: 'existingOrdinalId',
      price: 1234,
      sellerPaymentAddress: 'somePaymentAddress',
      sellerOrdinalPublicKey: 'someSellerOrdinalPublicKey',
      sellerOrdinalAddress: 'someSellerOrdinalAddress',
      walletProvider: WALLET_PROVIDER.xverse,
    }

    const response = await marketPlace.reListing(mockListingRequest)
    expect(response).to.have.property('psbt').that.equals('test_psbt')
    sinon.assert.calledWith(createListingStub, sinon.match(mockListingRequest))
  })
})

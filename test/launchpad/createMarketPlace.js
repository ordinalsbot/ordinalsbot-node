const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Launchpad Create Marketplace', function () {
  afterEach(() => {
    sinon.restore()
  })

  it('should return marketplace id and api key', async () => {
    // construct request payload LaunchpadMarketplaceCreateRequest
    const createMarketPlaceRequest = {
      name: 'someNamestring',
      launchpadSellerFee: 500,
      launchpadBuyerFee: 501,
      launchpadBtcFeePayoutAddress: 'someBtcFeeAddres',
      url: 'someUrlString',
      description: 'someTextForMarketPlace',
    }

    // construct request response LaunchpadMarketplaceCreateResponse
    const mockResponse = {
      marketPlaceId: 'someMarketPlaceId',
      apiKey: 'someApiKey',
    }

    sinon
      .stub(LaunchpadClient.prototype, 'createMarketPlace')
      .callsFake(() => mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.createMarketPlace(createMarketPlaceRequest)

    expect(response).to.equal(mockResponse)
    expect(response.marketPlaceId).to.be.a('string')
    expect(response.apiKey).to.be.a('string')
    expect(LaunchpadClient.prototype.createMarketPlace.calledOnce).to.be.true
  })
})

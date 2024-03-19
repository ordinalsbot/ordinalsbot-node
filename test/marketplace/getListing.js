const { expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { LISTING_STATUS } = require('../../dist/types/marketplace_types')

const sandbox = sinon.createSandbox()
describe('Marketplace getListing Ordinal', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should return the listing response', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const mockResponse = {
      results: [
        {
          ordinalId: 'someOrdinalId',
          price: 1200,
        },
      ],
      count: 1,
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    }
    const listingStub = sandbox
      .stub(marketPlace, 'getListing')
      .resolves(mockResponse)

    // Constructing a mock request based on MarketplaceGetListingResponse type
    const mockRequest = {
      filter: { status: LISTING_STATUS.active },
      page: 1,
      itemsPerPage: 100,
      sort: 'time',
    }

    const response = await marketPlace.getListing(mockRequest)

    expect(response).to.have.property('results').that.an('array')

    expect(response).to.have.property('count').that.a('number')

    expect(response).to.have.property('currentPage').that.a('number')

    expect(response).to.have.property('totalPages').that.a('number')

    expect(response).to.have.property('totalItems').that.a('number')

    sinon.assert.calledWith(listingStub, sinon.match(mockRequest))
  })
})

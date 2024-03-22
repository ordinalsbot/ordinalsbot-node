const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')
const { LAUNCHPAD_STATUS } = require('../../dist/types/launchpad_types')

describe('Get Launchpad listing', function () {
  afterEach(() => {
    sinon.restore()
  })

  it('should return launchpad listings', async () => {
    // construct request payload GetListingRequest
    const getLaunchpadListingRequest = {
      filter: { status: LAUNCHPAD_STATUS.active },
      page: 1,
      itemsPerPage: 100,
      sort: 'time',
    }
    const mockResponse = {
      results: [
        {
          _id: '65e852227146e99247bf4489',
          sellerPaymentAddress: '2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL',
          sellerOrdinalPublicKey:
            'e581edf3a948470930171a3e676490a8f7953a3698044c14b4d75ffeabc88a26',
          marketPlaceId: '65e6f865fbdbaaa3d7f1bc9f',
          metaData:
            '{"title":"This is SDK","description":"description SDK","imageURL":"url sdk"}',
          createdAt: '2024-03-06T11:23:14.155Z',
          updatedAt: '2024-03-06T11:23:30.731Z',
          phases: [
            {
              _id: '65e852227146e99247bf448c',
              ordinals: 5,
              available: 5,
              allowList: {
                '': {
                  allocation: '',
                },
              },
              isPublic: true,
              price: 3600,
              startDate: '2024-03-05T18:30:00.000Z',
              endDate: '2024-03-07T18:30:00.000Z',
            },
          ],
          totalOrdinals: 5,
          available: 5,
        },
        {
          _id: '65e94e73bac282b5264954f3',
          sellerPaymentAddress: '2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL',
          sellerOrdinalPublicKey:
            'e581edf3a948470930171a3e676490a8f7953a3698044c14b4d75ffeabc88a26',
          marketPlaceId: '65e6f865fbdbaaa3d7f1bc9f',
          metaData:
            '{"title":"Protected launcpad","description":"abc desc","imageURL":"img url"}',
          createdAt: '2024-03-07T05:19:47.071Z',
          updatedAt: '2024-03-07T05:20:01.137Z',
          phases: [
            {
              _id: '65e94e73bac282b5264954f6',
              ordinals: 5,
              available: 4,
              allowList: {
                tb1p79l2gnn7u8uqxfepd7ddeeajzrmuv9nkl20wpf77t2u473a2h89s483yk3:
                  {
                    allocation: '1',
                    inscriptionsClaimed: 1,
                  },
                tb1pmxq57zwa8uluf7dp86g9wj0adq7z9vuea02e9x0lsq9escnu4kusnuvau0:
                  {
                    allocation: '3',
                  },
                tb1pl8yv6f76eq7n83gfgh3w9ktdjm2ljtvhlmxeqhdjkq0zpwnryj3q0a9gk8:
                  {
                    allocation: '1',
                  },
              },
              isPublic: false,
              price: 3620,
              startDate: '2024-03-07T05:17:00.000Z',
              endDate: '2024-03-08T05:19:00.000Z',
            },
          ],
          totalOrdinals: 5,
          available: 4,
        },
        {
          _id: '65f002ad9bb4d7453e8b4cf9',
          sellerPaymentAddress: '2N6ZePLQrKtix9bJBfznsykxKX1XtirnbKL',
          sellerOrdinalPublicKey:
            'e581edf3a948470930171a3e676490a8f7953a3698044c14b4d75ffeabc88a26',
          marketPlaceId: '65e6f865fbdbaaa3d7f1bc9f',
          metaData:
            '{"title":"Abc titit","description":"her i\'m the ownder","imageURL":"her i\'m the ownder"}',
          createdAt: '2024-03-12T07:22:21.725Z',
          updatedAt: '2024-03-12T07:22:36.370Z',
          phases: [
            {
              _id: '65f002ad9bb4d7453e8b4cfc',
              ordinals: 5,
              available: 5,
              allowList: {
                '': {
                  allocation: '',
                },
              },
              isPublic: true,
              price: 3265,
              startDate: '2024-03-11T18:30:00.000Z',
              endDate: '2024-03-12T18:30:00.000Z',
            },
          ],
          totalOrdinals: 5,
          available: 5,
        },
      ],
      count: 3,
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
    }
    // construct request response getLaunchpadListingResponse
    sinon
      .stub(LaunchpadClient.prototype, 'getLaunchpadListing')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.getLaunchpadListing(
      getLaunchpadListingRequest
    )

    expect(response).to.equal(mockResponse)
    expect(response.results).to.be.a('array')
    expect(response.count).to.be.a('number')
    expect(response.currentPage).to.be.a('number')
    expect(response.totalPages).to.be.a('number')
    expect(response.totalItems).to.be.a('number')
    expect(LaunchpadClient.prototype.getLaunchpadListing.calledOnce).to.be.true
  })
})

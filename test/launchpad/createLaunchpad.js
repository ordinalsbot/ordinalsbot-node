const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

const sandbox = sinon.createSandbox()
describe('Launchpad Create Marketplace', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should return launchpadId and status without wallet provider', async () => {
    // construct request response LaunchpadMarketplaceCreateResponse
    const inputRequest = getValidTestInput
    const mockResponse = {
      launchpadId: 'someLaunchpadId',
      status: 'pending',
    }

    sinon
      .stub(LaunchpadClient.prototype, 'createLaunchpad')
      .callsFake(() => mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.createLaunchpad(inputRequest)

    expect(response).to.equal(mockResponse)
    expect(response.launchpadId).to.be.a('string')
    expect(response.status).to.be.a('string')
    expect(LaunchpadClient.prototype.createLaunchpad.calledOnce).to.be.true
  })

  /*
  it('should return launchpadId and status wallet provider', async () => {
    // construct request response LaunchpadMarketplaceCreateResponse
    const inputRequest = getValidTestInput
    inputRequest['walletProvider'] = 'Xverse'
    const mockResponse = {
      launchpadId: 'someLaunchpadId',
      status: 'pending',
    }

    sinon
      .stub(LaunchpadClient.prototype, 'createLaunchpad')
      .callsFake(() => mockResponse)

    const getLaunchpadPSBTMockResponse = {
      psbt: 'someLaunchpadId',
      status: 'pending',
    }

    sinon
      .stub(Launchpad.prototype, 'getLaunchpadPSBT')
      .callsFake(() => getLaunchpadPSBTMockResponse)
    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.createLaunchpad(inputRequest)

    expect(response).to.equal(mockResponse)
    expect(response.launchpadId).to.be.a('string')
    expect(response.status).to.be.a('string')
    expect(LaunchpadClient.prototype.createLaunchpad.calledOnce).to.be.true
  })
  */
})

const getValidTestInput = () => {
  // construct request payload CreateLaunchpadRequest
  return {
    phases: [
      {
        ordinals: [
          '8f46149faff54a7efe0c5c73a633077a8009b374ebcf6d80609807eab8d73218i0',
        ],
        allowList: {
          bc1pdtkxdpunmu9rfj7tcglt4kcg2qya8w4y4cxhqcy9fscqnwdk8c7q6ec2w3: {
            allocation: 5,
          },
          bc1pfy7uyj9ae9sfz3h0rqcgqn0vnq4tgh50yxrat7lmd46kxwqmcqxsvvm02l: {
            allocation: 5,
          },
          bc1p84ec5hn4asw90slszeje3yrnmzgapj0s9ern85zgh4kc9frqcl3q422dc2: {
            allocation: 1,
          },
        },
        isPublic: 0,
        price: 6000,
        startDate: '2023-12-14 18:12:00',
        endDate: '2023-12-20 18:12:00',
      },
      {
        ordinals: [
          '4c18610607628425b5e97e28c6b0fc6e330ddc4de69fc995f2a9144365e0994fi0',
        ],
        isPublic: 1,
        price: 8000,
        startDate: '2023-12-21 18:12:00',
        endDate: '2023-12-28 18:12:00',
      },
    ],
    sellerPaymentAddress: 'somePaymentAddress',
    sellerOrdinalPublicKey: 'someOrdinalPublicKey',
    sellerOrdinalAddress: 'someOrdinalAddress',
    metaData:
      '{"title":"This is amazing","description":"This is amaazing Descriptions","imageURL":"This is amazing image url"}',
  }
}

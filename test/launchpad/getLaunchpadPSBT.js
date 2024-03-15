const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

const sandbox = sinon.createSandbox()
describe('Get Launchpad Status', function () {
  it('should return status with the psbt ready to sign', async () => {
    const clock = sinon.useFakeTimers()
    // construct request payload LaunchpadMarketplaceCreateRequest
    const getLaunchpadPSBTRequest = {
      launchpadId: 'someNamestring',
      status: 'pending',
    }

    // construct request response LaunchpadMarketplaceCreateResponse
    const mockResponse = {
      psbt: 'encodedPSBTString',
      status: 'Pending Buyer Confirmation',
    }

    sinon
      .stub(LaunchpadClient.prototype, 'getLaunchpadStatus')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.getLaunchpadPSBT(getLaunchpadPSBTRequest)
    clock.tick(5 * 60 * 1000)
    expect(response).to.be.a('object')
    expect(response.psbt).to.be.a('string')
    expect(response.status).to.be.a('string')
    expect(LaunchpadClient.prototype.getLaunchpadStatus.calledOnce).to.be.true
    clock.restore()
  })

  afterEach(() => {
    sinon.restore()
  })
})

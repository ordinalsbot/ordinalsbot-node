const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Confirm Padding Outputs ', function () {
  afterEach(() => {
    sinon.restore()
  })

  it('Should return true if the buyer has padding Outputs', async () => {
    // construct request payload confirmPaddingOutputsRequest
    const confirmPaddingOutputsRequest = {
      address: 'paymentAddress',
    }

    const mockResponse = {
      paddingOutputsExist: true,
    }
    // construct request response confirmPaddingOutputsResponse
    sinon
      .stub(LaunchpadClient.prototype, 'confirmPaddingOutputs')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.confirmPaddingOutputs(
      confirmPaddingOutputsRequest
    )

    expect(response).to.equal(mockResponse)
    expect(response.paddingOutputsExist).to.be.a('boolean')
    expect(LaunchpadClient.prototype.confirmPaddingOutputs.calledOnce).to.be
      .true
    sinon.restore()
  })

  it('Should return false if the buyer has padding Outputs', async () => {
    // construct request payload confirmPaddingOutputsRequest
    const confirmPaddingOutputsRequest = {
      address: 'paymentAddress',
    }

    const mockResponse = {
      paddingOutputsExist: false,
    }
    // construct request response confirmPaddingOutputsResponse
    sinon
      .stub(LaunchpadClient.prototype, 'confirmPaddingOutputs')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.confirmPaddingOutputs(
      confirmPaddingOutputsRequest
    )

    expect(response).to.equal(mockResponse)
    expect(response.paddingOutputsExist).to.be.a('boolean')
    expect(LaunchpadClient.prototype.confirmPaddingOutputs.calledOnce).to.be.true
    sinon.restore()
  })
})

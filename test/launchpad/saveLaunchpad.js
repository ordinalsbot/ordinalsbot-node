const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Save Launchpad', function () {
  afterEach(() => {
    sinon.restore()
  })

  it('should return success after successfully update the psbt on the launchpad', async () => {
    // construct request payload SaveLaunchpadRequest
    const saveLaunchpadRequest = {
      launchpadId: 'someLaunchpadId',
      updateLaunchData: {
        /** signed psbt by the seller to updated */
        signedListingPSBT: 'someSignedPSBTString',
      },
    }

    // construct request response SaveLaunchpadResponse
    sinon.stub(LaunchpadClient.prototype, 'saveLaunchpad').resolves({
      message: 'Launchpad listing is updated successfully',
    })

    const launchpad = new Launchpad('someApiKey', 'testnet')
    const response = await launchpad.saveLaunchpad(saveLaunchpadRequest)

    expect(response).to.be.a('object')
    expect(response.message).to.be.a('string')
    expect(LaunchpadClient.prototype.saveLaunchpad.calledOnce).to.be.true
  })
})

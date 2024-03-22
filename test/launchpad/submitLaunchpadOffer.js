const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Submit Launchpad Offer', function () {
  afterEach(() => {
    sinon.restore()
  })

  it('should return broadcast transaction txId', async () => {
    // construct request payload SubmitLaunchpadOfferRequest
    const submitLaunchpadOfferRequest = {
      ordinalId: 'someLaunchpadId',
      launchpadPhase: 'someLaunchpadPhase',
      signedBuyerPSBTBase64: 'someSignedPSBTString',
    }

    // construct request response SubmitLaunchpadOfferResponse
    sinon.stub(LaunchpadClient.prototype, 'submitLaunchpadOffer').resolves({
      txId: 'someTransactionString',
    })

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.submitLaunchpadOffer(
      submitLaunchpadOfferRequest
    )

    expect(response).to.be.a('object')
    expect(response.txId).to.be.a('string')
    expect(LaunchpadClient.prototype.submitLaunchpadOffer.calledOnce).to.be.true
  })
})

const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')
describe('Create Launchpad offer', function () {
  it('should return psbt and buyerInputIndices without wallet provider', async () => {
    // construct request response createLaunchpadOfferRequest
    const inputRequest = getValidTestInput()
    const mockResponse = getValidResponse()
    sinon
      .stub(LaunchpadClient.prototype, 'createLaunchpadOffer')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.createLaunchpadOffer(inputRequest)

    expect(response).to.be.a('object')
    expect(response.phase).to.be.a('object')
    expect(response.ordinalId).to.be.a('string')
    expect(response.launchpadPhase).to.be.a('string')
    expect(response.buyerInputIndices).to.be.a('array')
    expect(response.psbt).to.be.a('string')
    expect(LaunchpadClient.prototype.createLaunchpadOffer.calledOnce).to.be.true
    sinon.restore()
  })

  it('should return signedBuyerPSBTBase64 with wallet provider', async () => {
    // construct request response createLaunchpadOfferRequest
    const inputRequest = getValidTestInput()
    inputRequest.walletProvider = 'Xverse'

    const mockResponse = getValidResponse()
    sinon
      .stub(LaunchpadClient.prototype, 'createLaunchpadOffer')
      .resolves(mockResponse)

    sinon.stub(Launchpad.prototype, 'satsConnectWrapper').resolves({
      success: true,
      message: 'Transaction successfull',
      psbtBase64: 'someString',
      txId: 'someTransactionID',
    })

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.createLaunchpadOffer(inputRequest)

    expect(response).to.be.a('object')
    expect(response.ordinalId).to.be.a('string')
    expect(response.launchpadPhase).to.be.a('string')
    expect(response.signedBuyerPSBTBase64).to.be.a('string')
    expect(LaunchpadClient.prototype.createLaunchpadOffer.calledOnce).to.be.true
    expect(Launchpad.prototype.satsConnectWrapper.calledOnce).to.be.true
    sinon.restore()
  })
})

function getValidTestInput() {
  // construct request payload createLaunchpadOfferRequest
  return {
    launchpadId: 'someLaunchpadId',
    launchpadPhaseId: 'someLaunchpadPhaseId',
    buyerPaymentAddress: 'someBuyerPaymentAddress',
    buyerOrdinalAddress: 'someBuyerOrdinalAddress',
    buyerPaymentPublicKey: 'someBuyerPaymentPublicKey',
  }
}
function getValidResponse() {
  // construct request payload CreateLaunchpadOfferResponse
  return {
    phase: {
      _id: 'someLaunchpadPhaseId',
      isPublic: false,
      price: 1500,
      startDate: '2024-01-08T00:00:00.000Z',
      endDate: '2024-01-14T00:00:00.000Z',
    },
    ordinalId: 'someOrdinalId',
    launchpadPhase: 'someLaunchpadPhaseId',
    buyerInputIndices: [0, 1, 3],
    psbt: 'somePSBT',
  }
}

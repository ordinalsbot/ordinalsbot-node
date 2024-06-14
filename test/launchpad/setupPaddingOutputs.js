const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Setup Padding Outputs', function () {
  afterEach(() => {
    sinon.restore()
  })
  
  it('should return psbt and buyerInputIndices without wallet provider', async () => {
    // construct request response setupPaddingOutputsRequest
    const inputRequest = getValidTestInput()

    sinon.stub(LaunchpadClient.prototype, 'setupPaddingOutputs').resolves({
      psbt: 'somePSBTString',
      buyerInputIndices: [1],
    })
    const launchpad = new Launchpad('someApiKey', 'testnet')
    const response = await launchpad.setupPaddingOutputs(inputRequest)

    expect(response).to.be.a('object')
    expect(response.psbt).to.be.a('string')
    expect(response.buyerInputIndices).to.be.a('array')
    expect(LaunchpadClient.prototype.setupPaddingOutputs.calledOnce).to.be.true
    sinon.restore()
  })

  it('should return psbtBase64 and txId wallet provider', async () => {
    // construct request response setupPaddingOutputsRequest
    const inputRequest = getValidTestInput()

    inputRequest.walletProvider = 'Xverse'

    sinon.stub(LaunchpadClient.prototype, 'setupPaddingOutputs').resolves({
      psbt: 'somePSBTString',
      buyerInputIndices: [1],
    })

    sinon.stub(Launchpad.prototype, 'satsConnectWrapper').resolves({
      success: true,
      message: 'Transaction successfull',
      psbtBase64: 'someString',
      txId: 'someTransactionID',
    })

    const launchpad = new Launchpad('someApiKey', 'testnet')
    const response = await launchpad.setupPaddingOutputs(inputRequest)

    expect(response).to.be.a('object')
    expect(response.txId).to.be.a('string')
    expect(response.psbtBase64).to.be.a('string')
    expect(LaunchpadClient.prototype.setupPaddingOutputs.calledOnce).to.be.true
    expect(Launchpad.prototype.satsConnectWrapper.calledOnce).to.be.true
    sinon.restore()
  })
})

function getValidTestInput() {
  // construct request payload SetupPaddingOutputsRequest
  return {
    address: 'buyerPaymentAddress',
    publicKey: 'buyerPaymentPublic',
  }
}

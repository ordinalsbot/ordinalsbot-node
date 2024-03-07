const { expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { WALLET_PROVIDER } = require('../../dist/types/marketplace_types')

const sandbox = sinon.createSandbox()
describe('Marketplace DeList Ordinal', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should handle the DeList and transfer process to back to seller ordinal address', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const transferStub = sandbox.stub(marketPlace, 'deList').resolves({
      psbtBase64: 'somePSBTString',
      senderOrdinalInputs: [0],
      senderPaymentInputs: [1],
    })

    // Constructing a mock request based on MarketplaceDeListRequest type
    const mockTransferRequest = {
      ordinalId: 'someOrdinalId',
      senderPaymentAddress: 'someSenderPaymentAddress',
      senderPaymentPublicKey: 'someSenderPaymentPublicKey',
      senderOrdinalPublicKey: 'someSenderOrdinalPublicKey',
      senderOrdinalAddress: 'someSenderOrdinalAddress',
      walletProvider: WALLET_PROVIDER.xverse,
    }

    const response = await marketPlace.deList(mockTransferRequest)

    expect(response)
      .to.have.property('psbtBase64')
      .that.equals('somePSBTString')

    expect(response)
      .to.have.property('senderOrdinalInputs')
      .that.is.an('array')
      .that.includes(0)

    expect(response)
      .to.have.property('senderPaymentInputs')
      .that.is.an('array')
      .that.includes(1)

    sinon.assert.calledWith(transferStub, sinon.match(mockTransferRequest))
  })
})

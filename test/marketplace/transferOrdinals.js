const { expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { WALLET_PROVIDER } = require('../../dist/types/marketplace_types')

const sandbox = sinon.createSandbox()
describe('Marketplace Transfer Ordinals', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should handle the ordinal transfer process without wallet provider', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const transferStub = sandbox.stub(marketPlace, 'transfer').resolves({
      psbtBase64: 'somePSBTString',
      senderOrdinalInputs: [0],
      senderPaymentInputs: [1],
    })

    // Constructing a mock request based on MarketplaceTransferRequest type
    const mockTransferRequest = {
      transfer: [
        {
          ordinalId: 'someOrdinalId1',
          receiverOrdinalAddress: 'someReceiverOrdinalAddress1',
        },
        {
          ordinalId: 'someOrdinalId2',
          receiverOrdinalAddress: 'someReceiverOrdinalAddress2',
        },
      ],
      senderPaymentAddress: 'someSenderPaymentAddress',
      senderPaymentPublicKey: 'someSenderPaymentPublicKey',
      senderOrdinalPublicKey: 'someSenderOrdinalPublicKey',
      senderOrdinalAddress: 'someSenderOrdinalAddress',
    }

    const response = await marketPlace.transfer(mockTransferRequest)

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

  it('should handle the ordinal transfer process with wallet provider', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'dev')
    const transferStub = sandbox.stub(marketPlace, 'transfer').resolves({
      psbtBase64: 'somePSBTString',
      txId: 'someTransactionString'
    })

    // Constructing a mock request based on MarketplaceTransferRequest type
    const mockTransferRequest = {
      transfer: [
        {
          ordinalId: 'someOrdinalId1',
          receiverOrdinalAddress: 'someReceiverOrdinalAddress1',
        },
        {
          ordinalId: 'someOrdinalId2',
          receiverOrdinalAddress: 'someReceiverOrdinalAddress2',
        },
      ],
      senderPaymentAddress: 'someSenderPaymentAddress',
      senderPaymentPublicKey: 'someSenderPaymentPublicKey',
      senderOrdinalPublicKey: 'someSenderOrdinalPublicKey',
      senderOrdinalAddress: 'someSenderOrdinalAddress',
      walletProvider: WALLET_PROVIDER.xverse,
    }

    const response = await marketPlace.transfer(mockTransferRequest)

    expect(response)
      .to.have.property('psbtBase64')
      .that.equals('somePSBTString')

    expect(response)
    .to.have.property('txId')
    .that.equals('someTransactionString')

    sinon.assert.calledWith(transferStub, sinon.match(mockTransferRequest))
  })
})

const { expect } = require('chai')
const sinon = require('sinon')
const { MarketPlace } = require('../../dist')
const { WALLET_PROVIDER } = require('../../dist/types/marketplace_types')

const sandbox = sinon.createSandbox()
describe('Marketplace DeList Ordinal', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should handle the DeList and transfer process to back to seller ordinal address without wallet provider', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'testnet')
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
      senderOrdinalAddress: 'someSenderOrdinalAddress'
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

  it('should handle the DeList and transfer process to back to seller ordinal address with wallet provider', async () => {
    const marketPlace = new MarketPlace('someApiKey', 'testnet')
    const transferStub = sandbox.stub(marketPlace, 'deList').resolves({
      message: 'Ordinal successfully delisted',
      txId: 'someTransactionString'
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
      .to.have.property('message')
      .that.equals('Ordinal successfully delisted')
      
    expect(response)
      .to.have.property('txId')
      .that.equals('someTransactionString')
      

    sinon.assert.calledWith(transferStub, sinon.match(mockTransferRequest))
  })
})

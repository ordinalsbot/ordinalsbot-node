const { expect } = require('chai')
const sinon = require('sinon')
const { Inscription } = require('../../dist')
const { WALLET_PROVIDER } = require('../../dist/types/marketplace_types')

const sandbox = sinon.createSandbox()
describe('Create Parent Child PSBT', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should handle the create parent child psbt without wallet provider', async () => {
    const inscription = new Inscription('someApiKey', 'testnet')
    const createParentChildPsbtStub = sandbox.stub(inscription, 'createParentChildPsbt').resolves({
      psbtBase64: 'somePSBTString',
      ordinalInputIndices: [0],
      paymentInputIndices: [1],
      psbtHex: 'someHexString'
    })

    // Constructing a mock request based on createParentChildPsbt type
    const mockRequest = {
      orderId: 'someOrderId',
      userAddress: 'someUserPaymentAddress',
      userPublicKey: 'someUserPaymentPublicKey',
      userOrdinalPublicKey: 'someUserOrdinalPublicKey',
      userOrdinalsAddress: 'someUserOrdinalAddress',
      feeRate:28
    }

    const response = await inscription.createParentChildPsbt(mockRequest)

    expect(response)
      .to.have.property('psbtBase64')
      .that.equals('somePSBTString')

    expect(response)
      .to.have.property('ordinalInputIndices')
      .that.is.an('array')
      .that.includes(0)

    expect(response)
      .to.have.property('paymentInputIndices')
      .that.is.an('array')
      .that.includes(1)

    expect(response)
      .to.have.property('psbtHex')
      .that.equals('someHexString')

    sinon.assert.calledWith(createParentChildPsbtStub, sinon.match(mockRequest))
  })

  it('should handle the create parent child psbt wallet provider', async () => {
    const inscription = new Inscription('someApiKey', 'testnet')
    const createParentChildPsbtStub = sandbox.stub(inscription, 'createParentChildPsbt').resolves({
      psbtBase64: 'somePSBTString',
      ordinalInputIndices: [0],
      paymentInputIndices: [1],
      psbtHex: 'someHexString'
    })

    // Constructing a mock request based on createParentChildPsbt type
    const mockRequest = {
      orderId: 'someOrderId',
      userAddress: 'someUserPaymentAddress',
      userPublicKey: 'someUserPaymentPublicKey',
      userOrdinalPublicKey: 'someUserOrdinalPublicKey',
      userOrdinalsAddress: 'someUserOrdinalAddress',
      feeRate:28,
      walletProvider: WALLET_PROVIDER.xverse,
    }

    const response = await inscription.createParentChildPsbt(mockRequest)

    expect(response)
      .to.have.property('psbtBase64')
      .that.equals('somePSBTString')

    expect(response)
      .to.have.property('ordinalInputIndices')
      .that.is.an('array')
      .that.includes(0)

    expect(response)
      .to.have.property('paymentInputIndices')
      .that.is.an('array')
      .that.includes(1)

    expect(response)
      .to.have.property('psbtHex')
      .that.equals('someHexString')

    sinon.assert.calledWith(createParentChildPsbtStub, sinon.match(mockRequest))
  })
})

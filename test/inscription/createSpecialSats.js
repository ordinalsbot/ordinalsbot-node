const { expect } = require('chai')
const sinon = require('sinon')
const { Inscription, InscriptionClient } = require('../../dist')

const sandbox = sinon.createSandbox()
describe('Create Special Sats PSBT', function () {
  afterEach(() => {
    sandbox.restore()
  })

  it('should return psbt for special sats', async () => {
    const createSpecialSatsPSBTRequest = {
      chargeAmount: 2000,
      fundingAddress: 'someFundingAddress',
      specialSatsOutput: 'someSpecialSatsOutput',
      userAddress: 'someUserPaymentAddress',
      userPublicKey: 'someUserPaymentPublicKey',
      feeRate: 100,
    }

    const mockResponse = {
      psbt: 'somePSBTString',
    }

    sinon
      .stub(InscriptionClient.prototype, 'createSpecialSatsPSBT')
      .callsFake(() => mockResponse)

    const inscription = new Inscription('someApiKey', 'dev')
    const response = await inscription.createSpecialSatsPSBT(
      createSpecialSatsPSBTRequest
    )

    expect(response).to.equal(mockResponse)
    expect(response.psbt).to.be.a('string')
    expect(InscriptionClient.prototype.createSpecialSatsPSBT.calledOnce).to.be.true
  })
})

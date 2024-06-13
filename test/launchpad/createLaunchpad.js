const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Create Launchpad', function () {
  afterEach(() => {
    sinon.restore()
  })

  it('should return launchpadId and status without wallet provider', async () => {
    // construct request response CreateLaunchpadRequest
    const inputRequest = getValidTestInput()

    sinon.stub(LaunchpadClient.prototype, 'createLaunchpad').resolves({
      launchpadId: 'someLaunchpadId',
      status: 'pending',
    })
    const launchpad = new Launchpad('someApiKey', 'testnet')
    const response = await launchpad.createLaunchpad(inputRequest)

    expect(response).to.be.a('object')
    expect(response.launchpadId).to.be.a('string')
    expect(response.status).to.be.a('string')
    expect(LaunchpadClient.prototype.createLaunchpad.calledOnce).to.be.true
    sinon.restore()
  })

  it('should return update message with wallet provider', async () => {
    // construct request response CreateLaunchpadRequest
    const inputRequest = getValidTestInput()

    inputRequest.walletProvider = 'Xverse'

    sinon.stub(LaunchpadClient.prototype, 'createLaunchpad').resolves({
      launchpadId: 'someLaunchpadId',
      status: 'pending',
    })

    sinon.stub(Launchpad.prototype, 'getLaunchpadPSBT').resolves({
      psbt: 'encodedPSBTString',
      status: 'Pending Buyer Confirmation',
    })

    sinon.stub(Launchpad.prototype, 'satsConnectWrapper').resolves({
      success: true,
      message: 'Transaction successfull',
      psbtBase64: 'someString',
      txId: 'someTransactionID',
    })

    sinon.stub(Launchpad.prototype, 'saveLaunchpad').resolves({
      message: 'Launchpad listing is updated successfully',
    })

    const launchpad = new Launchpad('someApiKey', 'testnet')
    const response = await launchpad.createLaunchpad(inputRequest)

    expect(response).to.be.a('object')
    expect(response.message).to.be.a('string')
    expect(LaunchpadClient.prototype.createLaunchpad.calledOnce).to.be.true
    expect(Launchpad.prototype.getLaunchpadPSBT.calledOnce).to.be.true
    expect(Launchpad.prototype.satsConnectWrapper.calledOnce).to.be.true
    expect(Launchpad.prototype.saveLaunchpad.calledOnce).to.be.true
    sinon.restore()
  })
})

function getValidTestInput() {
  // construct request payload CreateLaunchpadRequest
  return {
    phases: [
      {
        ordinals: [
          'someOrdinalId1', 'someOrdinalId2', 'someOrdinalId3', 'someOrdinalId4', 'someOrdinalId-n'
        ],
        allowList: {
          someBuyerOrderAddres1: {
            allocation: 5,
          },
          someBuyerOrderAddres2: {
            allocation: 5,
          },
          someBuyerOrderAddres3: {
            allocation: 1,
          },
          someBuyerOrderAddresN: {
            allocation: 1,
          },
        },
        isPublic: 0,
        price: 6000,
        startDate: '2023-12-14 18:12:00',
        endDate: '2023-12-20 18:12:00',
      },
      {
        ordinals: [
          'someOrdinalId1',
        ],
        isPublic: 1,
        price: 8000,
        startDate: '2023-12-21 18:12:00',
        endDate: '2023-12-28 18:12:00',
      },
    ],
    sellerPaymentAddress: 'somePaymentAddress',
    sellerOrdinalPublicKey: 'someOrdinalPublicKey',
    sellerOrdinalAddress: 'someOrdinalAddress',
    metaData:
      '{"title":"This is amazing","description":"This is amaazing Descriptions","imageURL":"This is amazing image url"}',
  }
}

const { expect } = require('chai')
const sinon = require('sinon')
const { Launchpad } = require('../../dist/launchpad/index')
const { LaunchpadClient } = require('../../dist/launchpad/client')

describe('Get Buyer Allocation', function () {

  afterEach(() => {
    sinon.restore()
  })

  it('Should return the launchpad phases for the given buyer ordinal address', async () => {
    // construct request payload GetAllocationRequest
    const getAllocationRequest = {
      launchpadId: 'someLaunchpadId',
      buyerOrdinalAddress: 'buyerOrdinalAddress',
    }

    const mockResponse = {
      phases: [
        {
          id: 'launchpadPhaseId1',
          phases: false,
          allocation: '5',
          inscriptionsClaimed: 0,
        },
        {
          id: 'launchpadPhaseId2',
          phases: true,
        },
      ],
    }
    // construct request response GetAllocationResponse
    sinon
      .stub(LaunchpadClient.prototype, 'getAllocation')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.getAllocation(getAllocationRequest)

    expect(response).to.equal(mockResponse)
    expect(response.phases).to.be.a('array')
    expect(LaunchpadClient.prototype.getAllocation.calledOnce).to.be.true
    sinon.restore()
  })

  it('should return empty phases if no launchpad phase found for buyer ordinal addres', async () => {
    // construct request payload GetAllocationRequest
    const getAllocationRequest = {
      launchpadId: 'someLaunchpadId',
      buyerOrdinalAddress: 'buyerOrdinalAddress',
    }

    const mockResponse = {
      phases: [],
    }
    // construct request response GetAllocationResponse
    sinon
      .stub(LaunchpadClient.prototype, 'getAllocation')
      .resolves(mockResponse)

    const launchpad = new Launchpad('someApiKey', 'dev')
    const response = await launchpad.getAllocation(getAllocationRequest)

    expect(response).to.equal(mockResponse)
    expect(LaunchpadClient.prototype.getAllocation.calledOnce).to.be.true
    sinon.restore()
  })
})

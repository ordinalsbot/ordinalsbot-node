const { expect } = require("chai");
const nock = require("nock");
const { Launchpad } = require('../../dist/launchpad/index')
const { PaymentResult, MemoryTokenStore } = require('l402');

// Mock Wallet as it would be used within the Satscanner
class MockWallet  {
    payInvoice(invoice) {
        // Assuming payment is always successful for testing
        return Promise.resolve(new PaymentResult('mock-preimage', true));
    }
  }

describe("Launchpad with L402 Handling", () => {
    let launchpad;
    let wallet;
    let store;
    const request = {
      phases: [],
      metaData: {},
      sellerPaymentAddress: "",
      sellerOrdinalPublicKey: "",
      sellerOrdinalAddress: "",
      walletProvider: ""
    };
  
    beforeEach(() => {
      wallet = new MockWallet();
      store = new MemoryTokenStore();
  
      // Initialize Mempool with L402 enabled
      launchpad = new Launchpad("", "dev", {
        useL402: true,
        l402Config: {
            wallet: wallet,
            tokenStore: store
        }
      });
  
      // Setup nock to clean all interceptors
      nock.cleanAll();
    });
  
    it('should handle L402 Payment Required response by retrying the request', async () => {
      const resourceUrl = "https://ordinalsbot.ln.sulu.sh/launchpad/create-launch";
      const invoice = 'mockinvoice';
      
      // Simulate a 402 response with invoice details
      nock('https://ordinalsbot.ln.sulu.sh')
        .post('/launchpad/create-launch')
        .reply(402, '', {
            'WWW-Authenticate': `L402 invoice="${invoice}", macaroon="mockmacaroon"`
        });
  
      // Simulate successful access after payment
      nock('https://ordinalsbot.ln.sulu.sh')
        .post('/launchpad/create-launch')
        .reply(200, {data: 'data after L402 handled'});
  
      const response = await launchpad.createLaunchpad(request);
      expect(response).to.equal('data after L402 handled');
      expect(store.get(resourceUrl, 'POST')).to.include('mock-preimage');
    });
  
    it('should store and reuse tokens for subsequent requests', async () => {
      const resourceUrl = 'https://ordinalsbot.ln.sulu.sh/launchpad/create-launch';
      store.put(resourceUrl, 'L402 mocktoken', 'POST');
  
      nock('https://ordinalsbot.ln.sulu.sh')
          .post('/launchpad/create-launch')
          .matchHeader('Authorization', 'L402 mocktoken')
          .reply(200, {data: "data"});
  
      const response = await launchpad.createLaunchpad(request);
      expect(response).to.equal('data');
    });
  });
const { expect } = require("chai");
const nock = require("nock");
const { Inscription } = require("../../dist");
const { PaymentResult, MemoryTokenStore } = require('l402');

// Mock Wallet as it would be used within the Satscanner
class MockWallet  {
    payInvoice(invoice) {
        // Assuming payment is always successful for testing
        return Promise.resolve(new PaymentResult('mock-preimage', true));
    }
  }

describe("Inscription with L402 Handling", () => {
    let inscription;
    let wallet;
    let store;
    const request = {
      size: 0,
      fee: 0,
      count: 0,
      rareSats: "",
      lowPostage: false,
      direct: false,
      additionalFee: 0,
      baseFee: 0
    };
  
    beforeEach(() => {
      wallet = new MockWallet();
      store = new MemoryTokenStore();
  
      // Initialize Mempool with L402 enabled
      inscription = new Inscription("", "testnet", {
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
      const resourceUrl = "https://ordinalsbot.ln.sulu.sh/price";
      const invoice = 'mockinvoice';
      
      // Simulate a 402 response with invoice details
      nock('https://ordinalsbot.ln.sulu.sh')
        .get('/price')
        .query(true)
        .reply(402, '', {
            'WWW-Authenticate': `L402 invoice="${invoice}", macaroon="mockmacaroon"`
        });
  
      // Simulate successful access after payment
      nock('https://ordinalsbot.ln.sulu.sh')
        .get('/price')
        .query(true)
        .reply(200, {data: 'data after L402 handled'});
  
      const response = await inscription.getPrice(request);
      expect(response).to.equal('data after L402 handled');
      expect(store.get(resourceUrl)).to.include('mock-preimage');
    });
  
    it('should store and reuse tokens for subsequent requests', async () => {
      const resourceUrl = 'https://ordinalsbot.ln.sulu.sh/price';
      store.put(resourceUrl, 'L402 mocktoken');
  
      nock('https://ordinalsbot.ln.sulu.sh')
          .get('/price')
          .query(true)
          .matchHeader('Authorization', 'L402 mocktoken')
          .reply(200, {data: "data"});
  
      const response = await inscription.getPrice(request);
      expect(response).to.equal('data');
    });
  });
const { expect } = require("chai");
const nock = require("nock");
const { MarketPlace } = require("../../dist");
const { PaymentResult, MemoryTokenStore } = require('l402');

// Mock Wallet as it would be used within the Satscanner
class MockWallet  {
    payInvoice(invoice) {
        // Assuming payment is always successful for testing
        return Promise.resolve(new PaymentResult('mock-preimage', true));
    }
  }

describe("Marketplace with L402 Handling", () => {
    let marketplace;
    let wallet;
    let store;
    const request = {
        name: "My Marketplace",
        sellerFee: 1000, 
        buyerFee: 500,  
        btcFeePayoutAddress: "1ABCxyz", 
        url: "https://example.com/marketplace",
        description: "This is a marketplace for buying and selling ordinals."
    };
  
    beforeEach(() => {
      wallet = new MockWallet();
      store = new MemoryTokenStore();
  
      // Initialize Mempool with L402 enabled
      marketplace = new MarketPlace("", "testnet", {
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
      const resourceUrl = "https://ordinalsbot.ln.sulu.sh/marketplace/create-marketplace";
      const invoice = 'mockinvoice';
      
      // Simulate a 402 response with invoice details
      nock('https://ordinalsbot.ln.sulu.sh')
        .post('/marketplace/create-marketplace')
        .reply(402, '', {
            'WWW-Authenticate': `L402 invoice="${invoice}", macaroon="mockmacaroon"`
        });
  
      // Simulate successful access after payment
      nock('https://ordinalsbot.ln.sulu.sh')
        .post('/marketplace/create-marketplace')
        .reply(200, {data: 'data after L402 handled'});
  
      const response = await marketplace.createMarketplace(request);
      expect(response).to.equal('data after L402 handled');
      expect(store.get(resourceUrl, 'POST')).to.include('mock-preimage');
    });
  
    it('should store and reuse tokens for subsequent requests', async () => {
      const resourceUrl = 'https://ordinalsbot.ln.sulu.sh/marketplace/create-marketplace';
      store.put(resourceUrl, 'L402 mocktoken', 'POST');
  
      nock('https://ordinalsbot.ln.sulu.sh')
          .post('/marketplace/create-marketplace')
          .matchHeader('Authorization', 'L402 mocktoken')
          .reply(200, {data: "data"});
  
      const response = await marketplace.createMarketplace(request);
      expect(response).to.equal('data');
    });
  });
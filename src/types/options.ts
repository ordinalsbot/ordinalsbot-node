import { Store, Wallet } from "l402";

// Define the options interface
export interface ClientOptions {
    useL402?: boolean;
    l402Config?: {
      wallet: Wallet;
      tokenStore: Store;
    };
  }
import { MempoolClient } from "./mempoolClient";
import { InscriptionEnv } from "./types";
import { 
  MempoolAddressUtxoResponse,
} from "./types/mempool_types";

export class Mempool {
  private mempoolInstance!: MempoolClient;

  constructor(key: string = "", environment: InscriptionEnv = "live") {
    if (this.mempoolInstance !== undefined) {
      console.error("mempool.setCredentials was called multiple times");
      return;
    }
    this.mempoolInstance = new MempoolClient(key, environment);
  }

  getAddressUtxo(
    address: string
  ): Promise<MempoolAddressUtxoResponse[]> {
    return this.mempoolInstance.getAddressUtxo(address);
  }
}

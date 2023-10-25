import { Injectable } from '@nestjs/common';
import { ethers, JsonRpcProvider, Wallet } from 'ethers';

@Injectable()
export class EthersService {
  protected provider: JsonRpcProvider;
  protected signer: Wallet;

  constructor(rpc: string, pk: string) {
    this.provider = new ethers.JsonRpcProvider(rpc);
    this.signer = new ethers.Wallet(pk, this.provider);
  }

  async getTransactionLogs(txHash: string) {
    const receipt = await this.provider.getTransactionReceipt(txHash);

    if (!receipt || !receipt.logs) {
      throw new Error('No logs found for this transaction');
    }

    return receipt.logs[0];
  }

  weiToEther(wei: ethers.BigNumberish): string {
    const etherValue = ethers.formatEther(wei);
    return etherValue;
  }

  etherToWei(etherValue: string) {
    return ethers.parseEther(etherValue);
  }
}

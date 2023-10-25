import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { BurnDTO } from '../dto/burt.tdo';
import { EthersService } from '../ethers.service';

@Injectable()
export class ERC721Service extends EthersService {
  protected zeroAddress = '0x0000000000000000000000000000000000000000';

  protected contract: Contract;
  protected contractWithSigner: Contract;

  constructor(rpc: string, pk: string, contractAddress: string, abi: string) {
    super(rpc, pk);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
    this.contractWithSigner = this.contract.connect(this.signer) as Contract;
  }

  async burn(data: BurnDTO) {
    return this.contractWithSigner.burn(data.tokenId);
  }

  async getMintedTokenId(txHash: string) {
    const result = await this.getTransactionLogs(txHash);
    return parseInt(result.topics[3], 16);
  }

  async fetchTransferEventsFrom0x0() {
    const contractAddress = await this.contract.getAddress();

    const filter = this.contract.filters.Transfer(this.zeroAddress, null, null);
    const eventTopic = await filter.getTopicFilter();
    const blockNumber = await this.provider.getBlockNumber();

    const logs = await this.provider.getLogs({
      address: contractAddress,
      topics: eventTopic,
      fromBlock: blockNumber - 1000,
      toBlock: blockNumber,
    });

    const parsedEvents = logs.map((log) =>
      this.contract.interface.parseLog({
        ...log,
        topics: [...log.topics],
      }),
    );

    const cleanedEvents = parsedEvents.map((event) => {
      const { args } = event;
      const newArgs = {};
      for (const key in args) {
        if (typeof args[key] === 'bigint') {
          newArgs[key] = args[key].toString();
        } else {
          newArgs[key] = args[key];
        }
      }
      return { ...event, args: newArgs };
    });

    return cleanedEvents;
  }
}

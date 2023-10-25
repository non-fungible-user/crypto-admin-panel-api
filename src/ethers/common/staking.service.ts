import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { EthersService } from '../ethers.service';

@Injectable()
export class StakingService extends EthersService {
  protected contract: Contract;
  protected contractWithSigner: Contract;

  constructor(rpc: string, pk: string, contractAddress: string, abi: string) {
    super(rpc, pk);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
    this.contractWithSigner = this.contract.connect(this.signer) as Contract;
  }

  async totalStaked() {
    const result = await this.contract.totalStaked();
    return this.weiToEther(result);
  }

  async getStakeList() {
    const result = await this.contract.getStakeList();

    return result;
  }

  async getStake(address: string, index: number) {
    const result = await this.contract.stakes(address, index);

    return result;
  }

  async pause() {
    return this.contractWithSigner.pause();
  }

  async unpause() {
    return this.contractWithSigner.unpause();
  }

  async withdrawTokens(tokenAddress: string, amount: number) {
    const weiAmount = this.etherToWei(amount.toString());
    return await this.contractWithSigner.withdrawTokens(
      tokenAddress,
      weiAmount,
    );
  }

  async setMinDeposit(minDeposit: number) {
    const weiAmount = this.etherToWei(minDeposit.toString());
    return await this.contractWithSigner.setMinDeposit(
      weiAmount,
    );
  }

  async getStakes(fromBlock: number) {
    const events = [];
    const rangeSize = 3000;

    const contractAddress = await this.contract.getAddress();

    const filter = this.contract.filters.Staked();
    const eventTopic = await filter.getTopicFilter();
    const blockNumber = await this.provider.getBlockNumber();

    for (let index = fromBlock; index < blockNumber; index += rangeSize) {
      const logs = await this.provider.getLogs({
        address: contractAddress,
        topics: eventTopic,
        fromBlock: index,
        toBlock: index + rangeSize, 
      });

      const parsedEvents = logs.map((log) =>
        this.contract.interface.parseLog({
          ...log,
          topics: [...log.topics],
        }),
      );

      parsedEvents.map((event) => {
        const { args } = event;
        const newArgs = {};
        for (const key in args) {
          if (typeof args[key] === 'bigint') {
            newArgs[key] = args[key].toString();
          } else {
            newArgs[key] = args[key];
          }
        }
 
        events.push({
          address: newArgs[0],
          amount: this.weiToEther(newArgs[1]),
          duration: newArgs[2],
          index: newArgs[3],
          price: this.weiToEther(newArgs[4]),
          blockNumber
        });
      });
    }

    return events;
  }
}

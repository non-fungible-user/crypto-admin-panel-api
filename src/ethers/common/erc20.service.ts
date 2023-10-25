import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { TransferDTO } from 'src/token/dto/transfer.dto';
import { EthersService } from '../ethers.service';

@Injectable()
export class ERC20Service extends EthersService {
  protected contract: Contract;
  protected contractWithSigner: Contract;

  constructor(rpc: string, pk: string, contractAddress: string, abi: string) {
    super(rpc, pk);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
    this.contractWithSigner = this.contract.connect(this.signer) as Contract;
  }

  async totalSupply() {
    return this.weiToEther(await this.contract.totalSupply());
  }

  async transfer({ to, amount }: TransferDTO) {
    const weiAmount = this.etherToWei(amount.toString());
    return await this.contractWithSigner.transfer(to, weiAmount);
  }
}

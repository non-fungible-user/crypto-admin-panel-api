import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import abi from 'src/config/abis/cac.abi';
import { ERC20Service } from 'src/ethers/common/erc20.service';
import { BlacklistDTO } from '../dto/blacklist.dto';
import { BurnDTO } from '../dto/burn.dto';
import { MintDTO } from '../dto/mint.dto';

@Injectable()
export class CalService extends ERC20Service {
  constructor(private readonly configService: ConfigService) {
    super(
      configService.get<string>('NETWORK_RPC'),
      configService.get<string>('PK_PROJECT'),
      configService.get<string>('CAL_TOKEN_ADDRESS'),
      JSON.stringify(abi),
    );
  }

  async isBlocked(address: string) {
    return this.contract.blacklists(address);
  }

  async mint(data: MintDTO) {
    return this.contractWithSigner.mint(data.address, data.amount);
  }

  async burn(data: BurnDTO) {
    return this.contractWithSigner.burn(data.amount);
  }

  async blacklist(data: BlacklistDTO) {
    return this.contractWithSigner.blacklist(data.address, data.isBlacklisting)
  }
}

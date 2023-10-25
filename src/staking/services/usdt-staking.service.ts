import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import abi from 'src/config/abis/usdt-staking.abi';
import { StakingService } from 'src/ethers/common/staking.service';
import { ServiceMap } from 'src/types/service';
import { StakedEvent } from 'src/types/stakedEvent';
import { StakingTokenNameEnum as TokenNameEnum } from '../../types/crypto';

@Injectable()
export class UsdtStakingService extends StakingService {
  constructor(
    private configService: ConfigService,
    @InjectModel('StakedEvent') private stakedEventModel: Model<StakedEvent>,
  ) {
    super(
      configService.get<string>('NETWORK_RPC'),
      configService.get<string>('PK'),
      configService.get<string>('USDT_STAKING_ADDRESS'),
      JSON.stringify(abi),
    );
  }

  async withdrawTokens(token: keyof ServiceMap, amount: number) {
    const tokenAddress = this.configService.get<string>(
      `${token.toUpperCase()}_TOKEN_ADDRESS`,
    );
    return super.withdrawTokens(tokenAddress, amount);
  }

  async getLatestStakedEvents() {
    const fromBlockCal = await this.stakedEventModel
      .findOne({ token: TokenNameEnum.USDT })
      .sort({ blockNumber: -1 })
      .select('blockNumber')
      .exec();

    return await this.getStakes(fromBlockCal?.blockNumber | 30697810);
  }

  async getStakedEventsFromDb() {
    return await this.stakedEventModel
      .find({ token: TokenNameEnum.USDT })
      .select('-price')
      .sort({ blockNumber: -1 })
      .exec();
  }
}

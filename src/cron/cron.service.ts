import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CalStakingService } from 'src/staking/services/cal-staking.service';
import { UsdtStakingService } from 'src/staking/services/usdt-staking.service';
import { StakedEvent } from 'src/types/stakedEvent';

@Injectable()
export class CronService {
  constructor(
    @InjectModel('StakedEvent') private stakedEventModel: Model<StakedEvent>,
    private readonly calStakingService: CalStakingService,
    private readonly usdtStakingService: UsdtStakingService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  // @Timeout(0)
  async syncStakingEvents() {
    const calStakes = await this.calStakingService.getLatestStakedEvents()
    const usdtStakes = await this.usdtStakingService.getLatestStakedEvents()

    await this.stakedEventModel.bulkSave(
      calStakes.map((item) => {
        return new this.stakedEventModel({ ...item, token: 'cal' });
      }),
    );

    await this.stakedEventModel.bulkSave(
      usdtStakes.map((item) => {
        return new this.stakedEventModel({ ...item, token: 'usdt' });
      }),
    );
  }
}

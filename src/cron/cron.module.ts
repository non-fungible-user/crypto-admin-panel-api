import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StakedEventSchema } from 'src/schemas/staked.events.schema';
import { StakingModule } from 'src/staking/staking.module';
import { CronService } from './cron.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StakedEvent', schema: StakedEventSchema },
    ]),
    StakingModule,
  ],
  providers: [CronService],
})
export class CronModule {}

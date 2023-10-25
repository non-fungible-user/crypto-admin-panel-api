import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EthersModule } from 'src/ethers/ethers.module';
import { StakedEventSchema } from 'src/schemas/staked.events.schema';
import { CalStakingService } from './services/cal-staking.service';
import { UsdtStakingService } from './services/usdt-staking.service';
import { StakingController } from './staking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StakedEvent', schema: StakedEventSchema },
    ]),
    EthersModule,
  ],
  controllers: [StakingController],
  providers: [CalStakingService, UsdtStakingService],
  exports: [CalStakingService, UsdtStakingService],
})
export class StakingModule {}

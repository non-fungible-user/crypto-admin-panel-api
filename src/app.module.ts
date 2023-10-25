import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { CronModule } from './cron/cron.module';
import { EthersModule } from './ethers/ethers.module';
import { NftModule } from './nft/nft.module';
import { StakingModule } from './staking/staking.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    EthersModule,
    StakingModule,
    TokenModule,
    NftModule,
    UserModule,
    AuthModule,
    CronModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

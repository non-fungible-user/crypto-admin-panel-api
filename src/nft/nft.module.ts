import { Module } from '@nestjs/common';
import { NftController } from './nft.controller';
import { GateIoService } from './services/gateio.service';
import { MembercardsService } from './services/membercards.service';
import { TShirtService } from './services/tshirt.service';

@Module({
  providers: [TShirtService, MembercardsService, GateIoService],
  controllers: [NftController],
})
export class NftModule {}

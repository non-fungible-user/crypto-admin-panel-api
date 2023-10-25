import { Module } from '@nestjs/common';
import { CacService } from './services/cac.service';
import { CalService } from './services/cal.service';
import { TokenController } from './token.controller';

@Module({
  providers: [CacService, CalService],
  controllers: [TokenController]
})
export class TokenModule {}

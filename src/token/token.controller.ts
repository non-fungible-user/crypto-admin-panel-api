import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonController } from 'src/common/controller/common.controller';
import { ResultModel } from 'src/common/models/result.model';
import { TokenLowercaseInterceptor } from 'src/interceptor/token-lowercase.interceptor';
import { TokenNameEnum } from 'src/types/crypto';
import { BlacklistDTO } from './dto/blacklist.dto';
import { BurnDTO } from './dto/burn.dto';
import { MintDTO } from './dto/mint.dto';
import { TransferDTO } from './dto/transfer.dto';
import { CacService } from './services/cac.service';
import { CalService } from './services/cal.service';
import { TokenEnum } from './types';

@ApiBearerAuth()
@ApiTags('token')
@Controller('token')
@UseInterceptors(TokenLowercaseInterceptor)
export class TokenController extends CommonController {
  constructor(
    private readonly cacService: CacService,
    private readonly calService: CalService,
  ) {
    super();
    this.services[TokenNameEnum.CAC] = { service: this.cacService };
    this.services[TokenNameEnum.CAL] = { service: this.calService };
  }

  callServiceByVariable(variable: string): any {
    if (this.services[variable]) {
      return this.services[variable].service;
    } else {
      throw new Error(`Service for '${variable}' is not available.`);
    }
  }

  @Get('/:token/totalSupply')
  @ApiParam({
    name: 'token',
    enum: TokenEnum,
    description: 'Token type (cac)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResultModel,
    description: 'Total supply',
  })
  async totalSupply(@Param('token') token: string) {
    try {
      const result = await this.callServiceByVariable(token).totalSupply();

      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:token/blacklists/:address')
  @ApiParam({
    name: 'token',
    enum: TokenEnum,
    description: 'Token type (cac or cal)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResultModel,
    description: 'Total supply',
  })
  async blacklists(
    @Param('token') token: string,
    @Param('address') address: string,
  ) {
    try {
      const result = await this.callServiceByVariable(token).isBlocked(address);

      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/mint')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenEnum,
    description: 'Token type (cac)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async mint(@Param('token') token: string, @Body() data: MintDTO) {
    try {
      return this.callServiceByVariable(token).mint(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/burn')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenEnum,
    description: 'Token type (cac or cal)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async burn(@Param('token') token: string, @Body() data: BurnDTO) {
    try {
      return this.callServiceByVariable(token).burn(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/blacklist')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenEnum,
    description: 'Token type (cac or cal)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async blacklist(@Param('token') token: string, @Body() data: BlacklistDTO) {
    try {
      return this.callServiceByVariable(token).blacklist(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/transfer')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenEnum,
    description: 'Token type (cac or cal)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async transfer(@Param('token') token: string, @Body() data: TransferDTO) {
    try {
      return this.callServiceByVariable(token).transfer(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

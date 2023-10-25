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
import { ResultModel } from '../common/models/result.model';
import { TokenLowercaseInterceptor } from '../interceptor/token-lowercase.interceptor';
import { StakingTokenNameEnum as TokenNameEnum } from '../types/crypto';
import { PauseDTO } from './dto/pause.dto';
import { WithdrawDTO } from './dto/withdraw.dto';
import { CalStakingService } from './services/cal-staking.service';
import { UsdtStakingService } from './services/usdt-staking.service';
  
@ApiBearerAuth()
@ApiTags('staking')
@Controller('staking')
@UseInterceptors(TokenLowercaseInterceptor)
export class StakingController extends CommonController {
  constructor(
    private readonly calStakingService: CalStakingService,
    private readonly usdtStakingService: UsdtStakingService,
  ) {
    super();
    this.services[TokenNameEnum.CAL] = { service: this.calStakingService };
    this.services[TokenNameEnum.USDT] = { service: this.usdtStakingService };
  }

  @Get('/:token/totalStaked')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: 'Token type (cal or usdt)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResultModel,
    description: 'Total staked',
  })
  async totalStaked(@Param('token') token: string) {
    try {
      const result = await this.callServiceByVariable(token).totalStaked();

      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:token/stakesList')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: 'Token type (cal or usdt)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResultModel,
    description: 'Total staked',
  })
  async stakesList(@Param('token') token: string) {
    try {
      const result = await this.callServiceByVariable(token).getStakedEventsFromDb();

      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:token/getStake/:address/:index')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: 'Token type (cal or usdt)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResultModel,
    description: 'Total staked',
  })
  async getStake(
    @Param('token') token: string,
    @Param('address') address: string,
    @Param('index') index: number,
  ) {
    try {
      const result = await this.callServiceByVariable(token).getStake(
        address,
        +index,
      );

      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/withdraw-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: 'Token type (cal or usdt)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async withdrawToken(@Param('token') token: string, @Body() dto: WithdrawDTO) {
    try {
      return this.callServiceByVariable(token).withdrawTokens(
        token,
        dto.amount,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/pause')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: 'Token type (cal or usdt)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async pause(@Param('token') token: string, @Body() dto: PauseDTO) {
    try {
      return dto.pause
        ? this.callServiceByVariable(token).pause()
        : this.callServiceByVariable(token).unpause();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

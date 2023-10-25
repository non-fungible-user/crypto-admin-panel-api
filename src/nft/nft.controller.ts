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
import { NftMintResultModel } from 'src/common/models/nft-mint-result.model';
import { ResultModel } from 'src/common/models/result.model';
import { BurnDTO } from 'src/ethers/dto/burt.tdo';
import { TokenLowercaseInterceptor } from 'src/interceptor/token-lowercase.interceptor';
import { enumValuesToString, waitForNSeconds } from 'src/utils';
import { NFTTokenNameEnum as TokenNameEnum } from '../types/crypto';
import { BaseUriDTO } from './dto/base-uri.dto';
import { MigrateToBatchDTO } from './dto/migrate-to-batch.dto';
import { MintToDTO } from './dto/mint-to.dto';
import { GateIoService } from './services/gateio.service';
import { MembercardsService } from './services/membercards.service';
import { TShirtService } from './services/tshirt.service';

@ApiBearerAuth()
@ApiTags('nft')
@Controller('nft')
@UseInterceptors(TokenLowercaseInterceptor)
export class NftController extends CommonController {
  constructor(
    private readonly tShirtService: TShirtService,
    private readonly membercardsService: MembercardsService,
    private readonly gateioService: GateIoService,
  ) {
    super();
    this.services[TokenNameEnum.MEMBERCARDS] = {
      service: this.membercardsService,
    };
    this.services[TokenNameEnum.TSHIRT] = { service: this.tShirtService };
    this.services[TokenNameEnum.GATEIO] = { service: this.gateioService };
  }

  @Get('/:token/tokenIdByTxHash/:hash')
  @ApiParam({
    name: 'hash',
    description: 'Tx hash',
  })
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResultModel,
    description: 'Token id',
  })
  async tokenIdByTxHash(@Param('hash') hash: string) {
    try {
      const result = await this.callServiceByVariable(
        'tshirt',
      ).getMintedTokenId(hash);

      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:token/mints')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
  })
  async totalStaked(@Param('token') token: string) {
    try {
      const result = await this.callServiceByVariable(
        token,
      ).fetchTransferEventsFrom0x0();
      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:token/totalSupply')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
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

  @Get('/:token/paused')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
  })
  async paused(@Param('token') token: string) {
    try {
      const result = await this.callServiceByVariable(token).paused();
      return { result: Boolean(result) };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/migrateToBatch')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
  })
  async migrateToBatch(
    @Body() dto: MigrateToBatchDTO,
    @Param('token') token: string,
  ) {
    try {
      const result = await this.callServiceByVariable(token).migrateToBatch(
        dto,
      );
      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/mintTo')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    type: NftMintResultModel,
    description: 'Token id',
  })
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
  })
  async mintTo(
    @Body() dto: MintToDTO,
    @Param('token') token: string,
  ): Promise<NftMintResultModel> {
    try {
      const tx = await this.callServiceByVariable(token).mintTo(dto);
      await waitForNSeconds(5);
      try {
        const tokenId = await this.callServiceByVariable(
          'tshirt',
        ).getMintedTokenId(tx.hash);
        return { tokenId, txHash: tx.hash };
      } catch (error) {
        return { tokenId: null, txHash: tx.hash };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/setBaseURI')
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction',
  })
  async setBaseURI(@Body() dto: BaseUriDTO, @Param('token') token: string) {
    try {
      const result = await this.callServiceByVariable(token).setBaseURI(dto);
      return { result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:token/burn')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'token',
    enum: TokenNameEnum,
    description: `Token type ${enumValuesToString(TokenNameEnum)}`,
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
}

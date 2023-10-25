import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';
import { MintToDTO } from './mint-to.dto';

export class MintToByIdDTO extends MintToDTO {
  @ApiProperty({ description: 'Token id', type: Number })
  @IsNotEmpty()
  @IsNumber()
  tokenId: number;
}

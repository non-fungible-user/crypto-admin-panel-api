import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class MintToBatchDTO {
  @ApiProperty({ description: 'Min to address', type: String })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({ description: 'Rarity type', type: Number })
  @IsNotEmpty()
  @IsNumber()
  rarityType: number;

  @ApiProperty({
    type: Number,
    isArray: true,
    description: 'Array of ids',
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ids: number[];
}

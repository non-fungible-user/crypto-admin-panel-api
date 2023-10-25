import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber
} from 'class-validator';
  
  export class RarityDetailsDTO {
    @ApiProperty({ description: 'Mint start id', type: Number })
    @IsNotEmpty()
    @IsNumber()
    mintStartId: number;

    @ApiProperty({ description: 'Mint price', type: Number })
    @IsNotEmpty()
    @IsNumber()
    mintPrice: number;
  }
  
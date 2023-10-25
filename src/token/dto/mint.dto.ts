import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MintDTO {
  @ApiProperty({ description: 'Address mint to', type: String })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Amount to mint', type: Number })
  @IsNotEmpty()
  @IsNumber()
  amount: number
}

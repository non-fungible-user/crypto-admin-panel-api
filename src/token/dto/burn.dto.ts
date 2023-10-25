import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BurnDTO {
  @ApiProperty({ description: 'Amount to burn', type: Number })
  @IsNotEmpty()
  @IsNumber()
  amount: number
}

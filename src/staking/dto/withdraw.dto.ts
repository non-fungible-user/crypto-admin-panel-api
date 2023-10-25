import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawDTO {
  @ApiProperty({ description: 'Amount', type: Number })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
 
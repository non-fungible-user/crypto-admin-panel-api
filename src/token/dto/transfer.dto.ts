import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransferDTO {
  @ApiProperty({ description: 'Transfer to address', type: String })
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty({ description: 'Amount to transfer', type: Number })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

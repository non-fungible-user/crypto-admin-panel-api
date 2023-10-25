import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class MintToDTO {
  @ApiProperty({ description: 'Mint to address', type: String })
  @IsNotEmpty()
  @IsString()
  to: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BurnDTO {
  @ApiProperty({ description: 'TokenId', type: String })
  @IsNotEmpty()
  tokenId: string
}

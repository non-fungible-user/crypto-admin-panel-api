import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BlacklistDTO {
  @ApiProperty({ description: 'Is blacklisting', type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  isBlacklisting: boolean;

  @ApiProperty({ description: 'Address', type: String })
  @IsNotEmpty()
  @IsString()
  address: string;
}

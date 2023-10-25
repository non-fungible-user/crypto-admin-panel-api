import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ description: 'Address', type: String })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password', type: String })
  @IsNotEmpty()
  @IsString()
  password: string;
}

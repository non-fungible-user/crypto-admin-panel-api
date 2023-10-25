import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class BaseUriDTO {
  @ApiProperty({ description: 'Base uri', type: String })
  @IsNotEmpty()
  @IsString()
  uri: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PauseDTO {
  @ApiProperty({ description: 'Pause status', type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  pause: boolean;
}

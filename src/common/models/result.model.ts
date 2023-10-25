import { ApiProperty } from '@nestjs/swagger';

export class ResultModel {
  @ApiProperty({ example: '1.1', description: 'Result string' })
  result: string;
}

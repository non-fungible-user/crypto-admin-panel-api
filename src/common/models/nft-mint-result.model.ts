import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NftMintResultModel {
  @ApiPropertyOptional({ example: 1 || null, description: 'Token ID' })
  tokenId?: number | null;

  @ApiProperty({ example: '0x0', description: 'Tx hash' })
  txHash: string;
}

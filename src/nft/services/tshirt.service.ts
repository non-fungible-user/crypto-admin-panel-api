import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import abi from 'src/config/abis/nft-tshirt.abi';
import { ERC721Service } from 'src/ethers/common/erc721.service';
import { BaseUriDTO } from '../dto/base-uri.dto';
import { MigrateToBatchDTO } from '../dto/migrate-to-batch.dto';
import { MintToDTO } from '../dto/mint-to.dto';
import { RarityDetailsDTO } from '../dto/rarity-details.dto';

@Injectable()
export class TShirtService extends ERC721Service {
  constructor(private readonly configService: ConfigService) {
    super(
      configService.get<string>('NETWORK_RPC'),
      configService.get<string>('PK'),
      configService.get<string>('NFT_TSHIRTS_ADDRESS'),
      JSON.stringify(abi),
    );
  }

  async migrateToBatch({ to, ids }: MigrateToBatchDTO) {
    return this.contractWithSigner.migrateToBatch(to, ids);
  }

  async mintTo({ to }: MintToDTO) {
    return this.contractWithSigner.mintTo(to);
  }

  async updateRarityDetails({ mintStartId, mintPrice }: RarityDetailsDTO) {
    return this.contractWithSigner.updateRarityDetails(mintStartId, mintPrice);
  }

  async setBaseURI({ uri }: BaseUriDTO) {
    return this.contractWithSigner.setBaseURI(uri);
  }

  async pause() {
    return this.contractWithSigner.pause();
  }

  async unpause() {
    return this.contractWithSigner.unpause();
  }

  async paused() {
    return this.contract.paused();
  }

  async totalSupply() {
    const result = await this.contract.totalSupply();
    return +result.toString();
  }
}

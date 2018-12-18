import { Module } from '@nestjs/common';
import { UtxoController } from 'controller/utxo.controller';
import { UtxoService } from 'service/utxo.service';

@Module({
  controllers: [UtxoController],
  providers: [UtxoService],
})
export class UxtoModule {}
import { Module } from '@nestjs/common';
import { UxtoModule } from 'module/utxo.module';

@Module({
  imports: [UxtoModule],
})
export class ApplicationModule {}
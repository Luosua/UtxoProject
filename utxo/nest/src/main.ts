import { NestFactory } from '@nestjs/core';
import {  } from 'module/utxo.module';
import { ApplicationModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(3000);
}
bootstrap();

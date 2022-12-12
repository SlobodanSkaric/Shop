import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/sorage.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{abortOnError: true});
  app.useStaticAssets(StorageConfig.photo.path, {
    prefix: StorageConfig.photo.urlPrefix,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    index: false
  })
  await app.listen(3000);
}
bootstrap();

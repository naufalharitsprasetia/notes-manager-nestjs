import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useBodyParser('urlencoded', { extended: true });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => {
    console.log('Application started successfully');
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });

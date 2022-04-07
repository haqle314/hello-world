import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';
import { LogInterceptor } from './log.interceptor';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,
  });
  app.useGlobalInterceptors(new LogInterceptor());
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Survey API')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets',
  });
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  app.use(
    session({
      // TODO fix this
      secret: process.env.SECRET_KEY ?? 'DO_SOMETHING_ABOUT_THIS',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();

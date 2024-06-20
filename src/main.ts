import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common/enums';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path'; // Ensure this line is added

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2'
  });

  app.use('/stripe-webhooks', express.raw({ type: 'application/json' }), (req, res, next) => {
    req['rawBody'] = req.body;
    next();
  });

  app.use(helmet());
  // app.use(compression());
  /* Swagger Setup*/
  const options = new DocumentBuilder()
    .setTitle('i-Refer API')
    .setDescription('API document for i-ReferV2')
    .setVersion('2.0')
    .addTag('i-Refer')
    .addBearerAuth()
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.startAllMicroservices();
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
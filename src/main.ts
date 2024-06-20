import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common/enums';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
// import * as compression from 'compression';
//import { MicroserviceOptions, MqttOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  app.startAllMicroservices();
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();

// Serverless below------------------------

// import { NestFactory } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import express from 'express';
// import serverlessHttp from 'serverless-http';
//
// let server: any;
//
// async function bootstrap() {
//   dotenv.config();
//   if (!server) {
//     const expressApp = express();
//
//     // Setup express middleware for JSON parsing and handling Stripe webhooks
//     expressApp.use(express.json());
//     expressApp.use('/stripe-webhooks', express.raw({ type: 'application/json' }), (req, res, next) => {
//       req['rawBody'] = req.body;
//       next();
//     });
//
//     const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
//     app.enableCors();
//
//     // Setup Swagger documentation
//     const options = new DocumentBuilder()
//       .setTitle('i-Refer API')
//       .setDescription('API document for i-ReferV2')
//       .setVersion('2.0')
//       .addTag('i-Refer')
//       .build();
//
//     const document = SwaggerModule.createDocument(app, options);
//     SwaggerModule.setup('api', app, document);
//
//     await app.init();
//     server = serverlessHttp(expressApp);
//   }
//   return server;
// }
//
// export const handler = async (event, context) => {
//   const server = await bootstrap();
//   return server(event, context, { callbackWaitsForEmptyEventLoop: false });
// };

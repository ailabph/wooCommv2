import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context } from 'aws-lambda';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { createServer, proxy } from "aws-serverless-express";
import express from 'express';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
let cacheServer: Server;

process.on("unhandledRejection", (reason) => {
    console.error(reason);
});

process.on("uncaughtException", (reason) => {
    console.error(reason);
});

const binaryMineTypes: string[] = [];

async function bootstrap() {
    if (!cacheServer) {
        const expressApp = express();
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
        app.use(cookieParser());


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
        app.use(compression());
        app.use(bodyParser.urlencoded({
            limit: '5mb',
            extended: false
        }));

        app.use(bodyParser.json({
            limit: '5mb'
        }));

        const options = new DocumentBuilder()
            .setTitle('i-Refer API')
            .setDescription('API document for i-ReferV2')
            .setVersion('2.0')
            .addTag('i-Refer')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);

        await app.init();
        cacheServer = createServer(expressApp, undefined, binaryMineTypes);
    }
    return cacheServer;
}

export const handler: Handler = async (
    event: any,
    context: Context
) => {

    console.log(event.path);
    if (event.path === '/api') {
        console.log(event.path);
        event.path = '/api/';
    }

    event.path = event.path.includes('swagger-ui') ? `/api${event.path}` : event.path;
    cacheServer = await bootstrap();
    return proxy(cacheServer, event, context, 'PROMISE').promise;
};

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

import { AppModule } from './app.module';
import { PaymentService } from './payment/payment.service';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware';
import { TreeService } from './tree/tree.service';
import { UserService } from './user/services/user.service';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  const webhook = express.json({
    verify: (req: any, res, buf, encoding) => {
      if (req.originalUrl.startsWith('/payment/webhook')) {
        req.rawBody = buf.toString((encoding as BufferEncoding) || 'utf8');
      }
    },
  });
  app.use(webhook);
  app.use(RequestIdMiddleware);

  app.enableCors({
    origin: [
      'https://www.rememberingtime.org',
      'https://rememberingtime.net',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Nestjs API starter')
    .setDescription('Nestjs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const treeService: TreeService = app.get(TreeService);
  const paymentService: PaymentService = app.get(PaymentService);
  const userService: UserService = app.get(UserService);

  await userService.initAdmin();
  await paymentService.initSlotsPricing();
  await paymentService.initCasketPricing();
  await treeService.initTreeTypes();

  const port: number = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();

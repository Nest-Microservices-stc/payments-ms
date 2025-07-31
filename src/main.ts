import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { ParseTrimStringPipe } from './common/pipes/parse-trim-string.pipe';
import * as bodyParser from 'body-parser';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-MS');
  const app = await NestFactory.create(AppModule);

  app.use('/payments/webhook', bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  app.use(bodyParser.json());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     exceptionFactory: (errors) => {
  //       const messages = errors.map(err => {
  //         const constraints = Object.values(err.constraints || {});
  //         return `${err.property} - ${constraints.join(', ')}`;
  //       });
  //       return new RpcException({
  //         statusCode: 400,
  //         message: messages.join(' ;;; ')
  //       });
  //     }
  //   })
  // );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers
    }
  }, {
    inheritAppConfig: true
  })

  await app.startAllMicroservices();
  await app.listen(envs.port);
  logger.log(`Payments-MS is running on port ${envs.port}`);
}
bootstrap();

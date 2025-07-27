import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { ParseTrimStringPipe } from './common/pipes/parse-trim-string.pipe';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const logger = new Logger('Payments-MS');
  const app = await NestFactory.create(AppModule);

  app.use('/payments/webhook', bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  app.use(bodyParser.json());

  app.useGlobalPipes(
    new ParseTrimStringPipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(envs.port);
  logger.log(`Payments-MS is running on port ${envs.port}`);
}
bootstrap();

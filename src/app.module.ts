import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';
import { NatsModule } from './transports/nats.module';


@Module({
  imports: [
    PaymentsModule,
    CommonModule
  ]
})
export class AppModule {}

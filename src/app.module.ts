import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';
import { NatsModule } from './transports/nats.module';
import { HealthCheckModule } from './health-check/health-check.module';


@Module({
  imports: [
    PaymentsModule,
    CommonModule,
    HealthCheckModule
  ]
})
export class AppModule {}

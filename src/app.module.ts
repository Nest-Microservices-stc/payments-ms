import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [PaymentsModule, CommonModule],
})
export class AppModule {}

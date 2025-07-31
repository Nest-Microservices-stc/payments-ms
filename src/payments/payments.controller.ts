import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @EventPattern('create.payment.session')
  async createPaymentSession(
    @Payload() createSessionDto: CreateSessionDto
  ) {
    return this.paymentsService.createPaymentSession(createSessionDto)
  }

  @Get('/successful')
  async successful() {
    return {
      message: 'payment successful',
    }
  }

  @Get('/cancelled')
  async cancelled() {
    return {
      message: 'payment cancelled',
    }
  }

  @Post('/webhook')
  async stripeWebhook(
    @Req() request: Request,
    @Res() response: Response
  ) {
    return this.paymentsService.stripeWebhook(request, response)
  }
}

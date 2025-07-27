import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('/create-payment-session')
  async createPaymentSession(
    @Body() createSessionDto: CreateSessionDto
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

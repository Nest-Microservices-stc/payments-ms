import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  
  @Get()
  check() {
    return 'Payments Microservice hybrid is running';
  }
}

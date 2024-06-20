import { Body, Controller, Get, Post, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/guards/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post()
  postHello(@Body() body: any): string {
    console.log(body);
    return 'Received: ' + JSON.stringify(body);
  }
}

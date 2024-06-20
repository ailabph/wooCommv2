import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/guards/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @Public()
  @Get('/check')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  healthCheck(): string {
    return 'OK';
  }
}

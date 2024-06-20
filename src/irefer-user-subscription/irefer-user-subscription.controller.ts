import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { IreferUserSubscriptionService } from './irefer-user-subscription.service';
import { Public } from '../auth/guards/public.decorator';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserSubscription } from '../schemas/irefer/user_subscription.schemas';

@Controller('irefer-user-subscription')
export class IreferUserSubscriptionController {
  constructor(
    private readonly ireferUserSubscriptionService: IreferUserSubscriptionService,
  ) {}

  @Public()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve a user subscription using their user ID' })
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
    description: 'The user ID associated with the subscription to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user subscription',
    type: UserSubscription,
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID provided' })
  @ApiResponse({
    status: 404,
    description: 'No user subscription found with the provided user ID',
  })
  async getByUserIdStrict(
    @Param('userId') userId: string,
  ): Promise<UserSubscription> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    try {
      return await this.ireferUserSubscriptionService.getByUserIdStrict(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

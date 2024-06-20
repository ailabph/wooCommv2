import { Module } from '@nestjs/common';
import { IreferUserSubscriptionService } from './irefer-user-subscription.service';
import { IreferUserSubscriptionController } from './irefer-user-subscription.controller';

import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSubscription,
  UserSubscriptionSchema,
} from '../schemas/irefer/user_subscription.schemas';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: UserSubscription.name, schema: UserSubscriptionSchema }],
      'irefer',
    ),
  ],
  controllers: [IreferUserSubscriptionController],
  providers: [IreferUserSubscriptionService],
  exports: [IreferUserSubscriptionService],
})
export class IreferUserSubscriptionModule {}

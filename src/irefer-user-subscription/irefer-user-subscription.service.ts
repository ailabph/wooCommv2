import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSubscription } from '../schemas/irefer/user_subscription.schemas';
import { Model } from 'mongoose';

@Injectable()
export class IreferUserSubscriptionService {
  constructor(
    @InjectModel(UserSubscription.name, 'irefer')
    private userSubscriptionModel: Model<UserSubscription>,
  ) {}

  async getByUserId(userId: string): Promise<UserSubscription | null> {
    console.log('getByUserId: Received user ID:', userId);

    const userSubscription = await this.userSubscriptionModel
      .findOne({ user_id: userId })
      .exec();

    if (userSubscription) {
      console.log('getByUserId: User subscription found:', userSubscription);
    } else {
      console.log(
        'getByUserId: No user subscription found for user ID:',
        userId,
      );
    }

    return userSubscription ?? null;
  }

  async getByUserIdStrict(userId: string): Promise<UserSubscription> {
    const userSubscription = await this.getByUserId(userId);
    if (!userSubscription) {
      throw new NotFoundException(
        `User subscription not found for user ID: ${userId}`,
      );
    }
    return userSubscription;
  }
}

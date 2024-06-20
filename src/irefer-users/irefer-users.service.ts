import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/irefer/users.schema';

@Injectable()
export class IreferUsersService {
  constructor(
    @InjectModel(User.name, 'irefer') private userModel: Model<User>,
  ) {}

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ user_id: userId }).exec();
      return user ?? null;
    } catch (error) {
      return null;
    }
  }

  async getUserByIdStrict(userId: string): Promise<User> {
    const user = await this.getUserById(userId);
    if (user === null) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ?? null;
  }

  async getUserByEmailStrict(email: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (user === null) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getUserByCogId(cogId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ cog_id: cogId }).exec();
    return user ?? null;
  }

  async getUserByCogIdStrict(cogId: string): Promise<User> {
    const user = await this.getUserByCogId(cogId);
    if (user === null) {
      throw new NotFoundException(`User with Cognito ID ${cogId} not found`);
    }
    return user;
  }
}

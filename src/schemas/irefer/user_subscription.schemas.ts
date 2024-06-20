import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  collection: 'user_subscription',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class UserSubscription extends Document {
  @ApiProperty({ type: String, description: 'The status of the subscription' })
  @Prop({ required: true })
  status: string;

  @ApiProperty({
    type: String,
    description: 'The user ID associated with the subscription',
  })
  @Prop({ required: true })
  user_id: string;

  @ApiProperty({ type: String, description: 'The type of the subscription' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({
    type: String,
    description: 'The user type associated with the subscription',
  })
  @Prop({ required: true })
  user_type: string;
}

export const UserSubscriptionSchema =
  SchemaFactory.createForClass(UserSubscription);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/constants/role.enum';
import { Gender } from '../../common/constants/gender.enum';

@Schema({
  collection: 'users',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends Document {
  @ApiProperty({ type: String, description: 'The user ID' })
  @Prop({ required: true })
  user_id: string;

  @ApiProperty({ type: String, description: 'The Cognito user ID' })
  @Prop({ required: true })
  cog_id: string;

  @ApiProperty({ type: String, description: 'The user email' })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ enum: Role, description: 'The user role' })
  @Prop({ required: true, enum: Role })
  role: Role;

  @ApiProperty({ type: String, description: 'The user phone number' })
  @Prop()
  phone: string;

  @ApiProperty({ type: String, description: 'The user status' })
  @Prop()
  status: string;

  @ApiProperty({ type: String, description: 'The user first name' })
  @Prop()
  first_name: string;

  @ApiProperty({ type: String, description: 'The user last name' })
  @Prop()
  last_name: string;

  @ApiProperty({ type: String, description: 'The username' })
  @Prop()
  user_name: string;

  @ApiProperty({ type: Date, description: 'The user date of birth' })
  @Prop()
  date_of_birth: Date;

  @ApiProperty({ enum: Gender, description: 'The user gender' })
  @Prop({ enum: Gender })
  gender: Gender;

  @ApiProperty({ type: String, description: 'The user latitude' })
  @Prop()
  lat: string;

  @ApiProperty({ type: String, description: 'The user longitude' })
  @Prop()
  long: string;

  @ApiProperty({ type: String, description: 'The user postcode' })
  @Prop()
  postcode: string;

  @ApiProperty({ type: String, description: 'The user logo URL' })
  @Prop()
  logo: string;

  @ApiProperty({ type: Boolean, description: 'If email notification was sent' })
  @Prop()
  email_notification_sent: boolean;

  @ApiProperty({ type: [String], description: 'The user interests' })
  @Prop({ type: [String] })
  interest: string[];

  @ApiProperty({ type: [String], description: 'The user professions' })
  @Prop({ type: [String] })
  profession: string[];

  @ApiProperty({ type: Boolean, description: 'If user has 2FA enabled' })
  @Prop()
  is_2fa: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  collection: 'vendors',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Vendor extends Document {
  @ApiProperty({
    type: String,
    description: 'The user ID associated with the vendor',
  })
  @Prop({ required: true })
  user_id: string;

  @ApiProperty({ type: String, description: 'The ABN of the vendor' })
  @Prop({ required: true })
  abn: string;

  @ApiProperty({
    type: [String],
    description: 'The business categories of the vendor',
  })
  @Prop({ required: true })
  business_category: string[];

  @ApiProperty({ type: String, description: 'The business name of the vendor' })
  @Prop({ required: true })
  business_name: string;

  @ApiProperty({ type: String, description: 'The domain of the vendor' })
  @Prop({ required: true })
  domain: string;

  @ApiProperty({ type: String, description: 'The email of the vendor' })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ type: String, description: 'The first name of the vendor' })
  @Prop({ required: true })
  first_name: string;

  @ApiProperty({ type: Boolean, description: 'Whether the vendor is approved' })
  @Prop({ required: true })
  is_approved: boolean;

  @ApiProperty({ type: String, description: 'The last name of the vendor' })
  @Prop({ required: true })
  last_name: string;

  @ApiProperty({ type: String, description: 'The logo URL of the vendor' })
  @Prop({ required: true })
  logo: string;

  @ApiProperty({ type: String, description: 'The phone number of the vendor' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({
    type: [String],
    description: 'The technologies used by the vendor',
  })
  @Prop({ required: true })
  technology_use: string[];

  @ApiProperty({
    type: String,
    description: 'The year of incorporation of the vendor',
  })
  @Prop({ required: true })
  year_of_incorporation: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

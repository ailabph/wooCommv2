import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  collection: 'referral',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Referral extends Document {
  @ApiProperty({ type: String, description: 'The title of the referral' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ type: String, description: 'The product title' })
  @Prop({ required: true })
  product_title: string;

  @ApiProperty({ type: String, description: 'The product ID' })
  @Prop({ required: true })
  product_id: string;

  @ApiProperty({ type: String, description: 'The product image URL' })
  @Prop({ required: true })
  product_image: string;

  @ApiProperty({ type: String, description: 'The product referral URL' })
  @Prop({ required: true })
  product_referal_url: string;

  @ApiProperty({ type: String, description: 'The store URL' })
  @Prop({ required: true })
  store_url: string;

  @ApiProperty({ type: String, description: 'The iRefer code' })
  @Prop({ required: true })
  ireferal_code: string;

  @ApiProperty({ type: String, description: 'The product description' })
  @Prop()
  product_description: string;

  @ApiProperty({ type: String, description: 'The user ID' })
  @Prop({ required: true })
  user_id: string;

  @ApiProperty({ type: String, description: 'The rec ID' })
  @Prop({ required: true })
  rec_id: string;

  @ApiProperty({ type: String, description: 'The vendor ID' })
  @Prop({ required: true })
  vendor_id: string;

  @ApiProperty({ type: String, description: 'The custom image URL' })
  @Prop()
  custom_image: string;

  @ApiProperty({ type: String, description: 'The custom video URL' })
  @Prop()
  custom_video: string;

  @ApiProperty({ type: String, description: 'The custom description' })
  @Prop({ required: true })
  custom_description: string;

  @ApiProperty({ type: String, description: 'The referral origin URL' })
  @Prop({ required: true })
  referral_origin_url: string;

  @ApiProperty({ type: String, description: 'The referral shortened URL' })
  @Prop()
  referral_shorten_url: string;

  @ApiProperty({ type: Number, description: 'The total clicks' })
  @Prop({ required: true })
  total_click: number;

  @ApiProperty({ type: Number, description: 'The total impression clicks' })
  @Prop({ required: true })
  total_impression_click: number;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);

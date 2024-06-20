import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  collection: 'products',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Product extends Document {
  @ApiProperty({ type: String, description: 'The product title' })
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

  @ApiProperty({ type: String, description: 'The product description' })
  @Prop({ required: false })
  product_description?: string;

  @ApiProperty({ type: String, description: 'The user ID' })
  @Prop({ required: true })
  user_id: string;

  @ApiProperty({ type: String, description: 'The record ID' })
  @Prop({ required: false })
  rec_id?: string;

  @ApiProperty({ type: String, description: 'The vendor ID' })
  @Prop({ required: true })
  vendor_id: string;

  @ApiProperty({ type: String, description: 'The custom image URL' })
  @Prop({ required: false })
  custom_image?: string;

  @ApiProperty({ type: String, description: 'The custom video URL' })
  @Prop({ required: false })
  custom_video?: string;

  @ApiProperty({ type: String, description: 'The custom description' })
  @Prop({ required: false })
  custom_description?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

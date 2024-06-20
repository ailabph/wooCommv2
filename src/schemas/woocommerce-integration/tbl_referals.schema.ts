import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  collection: 'tbl_referals',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Referal extends Document {
  @ApiProperty({ type: String, description: 'The referal code' })
  @Prop({ required: true })
  referal_code: string;

  @ApiProperty({ type: String, description: 'The store URL' })
  @Prop({ required: true })
  store_url: string;

  @ApiProperty({ type: String, description: 'The product ID' })
  @Prop({ required: false })
  productid?: string;

  @ApiProperty({ type: String, description: 'The record ID' })
  @Prop({ required: false })
  rec_id?: string;

  @ApiProperty({ type: String, description: 'The IP address' })
  @Prop({ required: true })
  ip: string;

  @ApiProperty({ type: Date, description: 'The date of the referal' })
  @Prop({ required: true })
  date: Date;
}

export const ReferalSchema = SchemaFactory.createForClass(Referal);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  collection: 'tbl_vendors',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Vendor_Key extends Document {
  @ApiProperty({ type: String, description: 'The session ID for the vendor' })
  @Prop({ required: false })
  session_id: string;

  @ApiProperty({ type: String, description: 'The state for the vendor' })
  @Prop({ required: false })
  state: string;

  @ApiProperty({ type: Boolean, description: 'Is the session online' })
  @Prop({ required: false })
  is_online: boolean;

  @ApiProperty({ type: String, description: 'The access token for the vendor' })
  @Prop({ required: false })
  access_token: string;

  @ApiProperty({
    type: Date,
    description: 'The expiration date of the access token',
  })
  @Prop({ required: false })
  expires_at?: Date;

  @ApiProperty({ type: String, description: 'The scope of the access token' })
  @Prop({ required: false })
  scope: string;

  @ApiProperty({ type: String, description: 'The consumer key for the vendor' })
  @Prop({ required: true })
  consumer_key: string;

  @ApiProperty({ type: String, description: 'The shop URL or identifier' })
  @Prop({ required: true })
  shop: string;

  @ApiProperty({
    type: String,
    description: 'The consumer secret for the vendor',
  })
  @Prop({ required: true })
  consumer_secret: string;

  @ApiProperty({
    type: String,
    description: 'The consumer secret for the vendor',
  })
  @Prop({ required: false })
  endpoint_url?: string;

  @ApiProperty({ type: String, description: 'Platform type' })
  @Prop({ required: false })
  platform?: string;
}

export const VendorKeySchema = SchemaFactory.createForClass(Vendor_Key);

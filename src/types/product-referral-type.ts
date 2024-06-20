import { ApiProperty } from '@nestjs/swagger';

export class ProductReferral {
  // REFERRAL ID
  @ApiProperty({ type: String, nullable: true })
  _id?: string;

  @ApiProperty({ type: String, required: true })
  product_id: string;

  @ApiProperty({ type: String, nullable: true })
  product_referal_url?: string;

  @ApiProperty({ type: String, nullable: true })
  store_url?: string;

  @ApiProperty({ type: String, nullable: true })
  title?: string;

  @ApiProperty({ type: String, nullable: true })
  product_title?: string;

  @ApiProperty({ type: String, nullable: true })
  product_description?: string;

  @ApiProperty({ type: String, nullable: true })
  product_image?: string;

  @ApiProperty({ type: String, required: true })
  user_id: string;

  @ApiProperty({ type: String, required: true })
  first_name: string;

  @ApiProperty({ type: String, required: true })
  last_name: string;

  @ApiProperty({ type: String, default: '' })
  rec_id: string = '';

  @ApiProperty({ type: String, required: true })
  vendor_id: string;

  @ApiProperty({ type: String, nullable: true })
  custom_image?: string;

  @ApiProperty({ type: String, default: '' })
  custom_image_small: string = '';

  @ApiProperty({ type: String, default: '' })
  custom_image_medium: string = '';

  @ApiProperty({ type: String, nullable: true })
  custom_description?: string;

  @ApiProperty({ type: String, nullable: true })
  referral_shorten_url?: string;

  @ApiProperty({ type: String, nullable: true })
  custom_video?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { ProductWooImgType } from './product-woo-img';

export class ProductWooType {
  @ApiProperty({ type: Number, description: 'The ID of the product' })
  id: number;

  @ApiProperty({ type: String, description: 'The name of the product' })
  name: string;

  @ApiProperty({ type: String, description: 'The slug of the product' })
  slug: string;

  @ApiProperty({ type: String, description: 'The permalink of the product' })
  permalink: string;

  @ApiProperty({
    type: String,
    description: 'The date the product was created',
  })
  date_created: string;

  @ApiProperty({
    type: String,
    description: 'The date the product was modified',
  })
  date_modified: string;

  @ApiProperty({ type: String, description: 'The type of the product' })
  type: string;

  @ApiProperty({ type: String, description: 'The status of the product' })
  status: string;

  @ApiProperty({ type: String, description: 'The description of the product' })
  description: string;

  @ApiProperty({
    type: String,
    description: 'The short description of the product',
  })
  short_description: string;

  @ApiProperty({ type: String, description: 'The SKU of the product' })
  sku: string;

  @ApiProperty({ type: String, description: 'The price of the product' })
  price: string;

  @ApiProperty({
    type: String,
    description: 'The regular price of the product',
  })
  regular_price: string;

  @ApiProperty({ type: String, description: 'The sale price of the product' })
  sale_price: string;

  @ApiProperty({
    type: [ProductWooImgType],
    description: 'The images of the product',
    required: false,
  })
  images?: ProductWooImgType[];
}

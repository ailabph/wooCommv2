import { ApiProperty } from '@nestjs/swagger';

export class ProductInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  product_slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  short_description: string;

  @ApiProperty()
  product_image: string;

  @ApiProperty()
  price: number | string;

  @ApiProperty()
  product_permalink: string;
}

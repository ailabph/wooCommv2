import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DimensionsDto {
  @ApiProperty()
  @IsString()
  length: string;

  @ApiProperty()
  @IsString()
  width: string;

  @ApiProperty()
  @IsString()
  height: string;
}

class CategoryDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;
}

class ImageDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  date_created: string;

  @ApiProperty()
  @IsString()
  date_created_gmt: string;

  @ApiProperty()
  @IsString()
  date_modified: string;

  @ApiProperty()
  @IsString()
  date_modified_gmt: string;

  @ApiProperty()
  @IsString()
  src: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  alt: string;
}

export class WooProductV3Dto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  permalink: string;

  @ApiProperty()
  @IsString()
  date_created: string;

  @ApiProperty()
  @IsString()
  date_created_gmt: string;

  @ApiProperty()
  @IsString()
  date_modified: string;

  @ApiProperty()
  @IsString()
  date_modified_gmt: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsBoolean()
  featured: boolean;

  @ApiProperty()
  @IsString()
  catalog_visibility: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  short_description: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsString()
  regular_price: string;

  @ApiProperty()
  @IsString()
  sale_price: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  date_on_sale_from: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  date_on_sale_from_gmt: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  date_on_sale_to: string | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  date_on_sale_to_gmt: string | null;

  @ApiProperty()
  @IsBoolean()
  on_sale: boolean;

  @ApiProperty()
  @IsBoolean()
  purchasable: boolean;

  @ApiProperty()
  @IsNumber()
  total_sales: number;

  @ApiProperty()
  @IsBoolean()
  virtual: boolean;

  @ApiProperty()
  @IsBoolean()
  downloadable: boolean;

  @ApiProperty()
  @IsArray()
  downloads: any[];

  @ApiProperty()
  @IsNumber()
  download_limit: number;

  @ApiProperty()
  @IsNumber()
  download_expiry: number;

  @ApiProperty()
  @IsString()
  external_url: string;

  @ApiProperty()
  @IsString()
  button_text: string;

  @ApiProperty()
  @IsString()
  tax_status: string;

  @ApiProperty()
  @IsString()
  tax_class: string;

  @ApiProperty()
  @IsBoolean()
  manage_stock: boolean;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  stock_quantity: number | null;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  low_stock_amount: number | null;

  @ApiProperty()
  @IsBoolean()
  sold_individually: boolean;

  @ApiProperty()
  @IsString()
  weight: string;

  @ApiProperty({ type: DimensionsDto })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty()
  @IsBoolean()
  shipping_required: boolean;

  @ApiProperty()
  @IsBoolean()
  shipping_taxable: boolean;

  @ApiProperty()
  @IsString()
  shipping_class: string;

  @ApiProperty()
  @IsNumber()
  shipping_class_id: number;

  @ApiProperty()
  @IsBoolean()
  reviews_allowed: boolean;

  @ApiProperty()
  @IsString()
  average_rating: string;

  @ApiProperty()
  @IsNumber()
  rating_count: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  upsell_ids: number[];

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  cross_sell_ids: number[];

  @ApiProperty()
  @IsNumber()
  parent_id: number;

  @ApiProperty()
  @IsString()
  purchase_note: string;

  @ApiProperty({ type: [CategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @ApiProperty()
  @IsArray()
  tags: any[];

  @ApiProperty({ type: [ImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @ApiProperty()
  @IsString()
  price_html: string;

  @ApiProperty()
  @IsArray()
  related_ids: any[];

  @ApiProperty()
  @IsString()
  stock_status: string;

  @ApiProperty()
  @IsBoolean()
  has_options: boolean;

  @ApiProperty()
  @IsString()
  post_password: string;
}

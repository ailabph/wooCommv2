import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray } from 'class-validator';

export class MagentoProductDto {
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
  date_modified: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  status: string;

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
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  regular_price: number;

  @ApiProperty()
  @IsNumber()
  sale_price: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];
}

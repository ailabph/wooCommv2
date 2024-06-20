import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

class WooProductTitleDto {
  @ApiProperty()
  @IsString()
  rendered: string;
}

class WooProductContentDto {
  @ApiProperty()
  @IsString()
  rendered: string;

  @ApiProperty()
  @IsBoolean()
  protected: boolean;
}

class WooProductExcerptDto {
  @ApiProperty()
  @IsString()
  rendered: string;

  @ApiProperty()
  @IsBoolean()
  protected: boolean;
}

export class WooProductDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  date_gmt: string;

  @ApiProperty()
  @IsString()
  modified: string;

  @ApiProperty()
  @IsString()
  modified_gmt: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  link: string;

  @ApiProperty()
  title: WooProductTitleDto;

  @ApiProperty()
  content: WooProductContentDto;

  @ApiProperty()
  excerpt: WooProductExcerptDto;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  product_cat: number[];
}

export class WooProductsDto {
  @ApiProperty({ type: [WooProductDto] })
  @IsArray()
  products: WooProductDto[];
}

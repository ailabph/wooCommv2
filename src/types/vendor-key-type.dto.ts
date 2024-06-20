import { ApiProperty } from '@nestjs/swagger';

export class VendorKeyTypeDto {
  @ApiProperty({ required: false })
  session_id?: string;

  @ApiProperty({ required: false })
  state?: string;

  @ApiProperty({ required: false })
  is_online?: boolean;

  @ApiProperty({ required: false })
  access_token?: string;

  @ApiProperty({ required: false })
  expires_at?: string;

  @ApiProperty({ required: false })
  scope?: string;

  @ApiProperty()
  consumer_key: string;

  @ApiProperty()
  shop: string;

  @ApiProperty()
  consumer_secret: string;

  @ApiProperty({ required: false })
  endpoint_url?: string;

  @ApiProperty({ required: false })
  platform?: string;
}

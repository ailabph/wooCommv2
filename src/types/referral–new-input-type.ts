import { ApiProperty } from '@nestjs/swagger';

export class ReferralNewInput {
  @ApiProperty()
  product_url: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty({ default: '' })
  brand_url: string;

  @ApiProperty({ default: '' })
  referral_code: string;

  @ApiProperty({ default: '' })
  RecID: string;

  @ApiProperty({ default: '' })
  custom_image: string;

  @ApiProperty({ default: '' })
  custom_video: string;

  @ApiProperty({ default: '' })
  custom_description: string;
}

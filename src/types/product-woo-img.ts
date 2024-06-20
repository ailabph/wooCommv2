import { ApiProperty } from '@nestjs/swagger';

export class ProductWooImgType {
  @ApiProperty({ type: Number, description: 'The ID of the image' })
  id: number;

  @ApiProperty({ type: String, description: 'The date the image was created' })
  date_created: string;

  @ApiProperty({ type: String, description: 'The date the image was modified' })
  date_modified: string;

  @ApiProperty({ type: String, description: 'The source URL of the image' })
  src: string;

  @ApiProperty({ type: String, description: 'The name of the image' })
  name: string;

  @ApiProperty({ type: String, description: 'The alt text of the image' })
  alt: string;
}

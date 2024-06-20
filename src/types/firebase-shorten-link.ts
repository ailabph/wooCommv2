// src/types/firebase-shorten-link.ts
import { ApiProperty } from '@nestjs/swagger';

export class FirebaseShortenLink {
  @ApiProperty()
  shortLink: string;

  @ApiProperty()
  previewLink: string;
}
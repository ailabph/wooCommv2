import { ApiProperty } from "@nestjs/swagger";

export class KeyPayloadDto {
  consumer_key: string;
  storeurl: string;
  consumer_secret: string;
  endpoint_url?: string;
  platform?: string;
}

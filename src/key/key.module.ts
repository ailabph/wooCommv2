import { Module } from '@nestjs/common';
import { KeyService } from './key.service';
import { KeyController } from './key.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VendorKeySchema,
  Vendor_Key,
} from '../schemas/woocommerce-integration/tbl_vendor.schema';
import { KeyRepository } from './key.repository';
import { UtilitiesService } from '../utilities/utilities.service';

@Module({
  providers: [KeyService, KeyRepository, UtilitiesService],
  controllers: [KeyController],
  imports: [
    MongooseModule.forFeature(
      [{ name: Vendor_Key.name, schema: VendorKeySchema }],
      'irefer-shopify-integration',
    )
  ],
})
export class KeyModule {}

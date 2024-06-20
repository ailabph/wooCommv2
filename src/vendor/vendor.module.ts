import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorService } from './vendor.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { IreferVendorsModule } from '../irefer-vendors/irefer-vendors.module';
import {
  Vendor_Key,
  VendorKeySchema,
} from '../schemas/woocommerce-integration/tbl_vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Vendor_Key.name, schema: VendorKeySchema }],
      'irefer-shopify-integration',
    ),
    UtilitiesModule,
    IreferVendorsModule,
  ],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}

import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VendorKeySchema,
  Vendor_Key,
} from '../schemas/woocommerce-integration/tbl_vendor.schema';
import { ProductExternalService } from './product.external';
import { VendorService } from '../vendor/vendor.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { IreferProductsModule } from '../irefer-products/irefer-products.module';
import { IreferVendorsService } from '../irefer-vendors/irefer-vendors.service';
import { IreferVendorsModule } from '../irefer-vendors/irefer-vendors.module';

@Module({
  providers: [ProductService, ProductExternalService, VendorService],
  imports: [
    MongooseModule.forFeature(
      [{ name: Vendor_Key.name, schema: VendorKeySchema }],
      'irefer-shopify-integration',
    ),
    UtilitiesModule,
    IreferProductsModule,
    IreferVendorsModule,
  ],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

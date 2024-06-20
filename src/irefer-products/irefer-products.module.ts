import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IreferProductsController } from './irefer-products.controller';
import { IreferProductsService } from './irefer-products.service';
import { Product, ProductSchema } from '../schemas/irefer/products.schema';
import { UtilitiesModule } from '../utilities/utilities.module';
import { VendorModule } from '../vendor/vendor.module';
import { IreferVendorsModule } from '../irefer-vendors/irefer-vendors.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Product.name, schema: ProductSchema }],
      'irefer',
    ),
    UtilitiesModule,
    VendorModule,
    IreferVendorsModule,
  ],
  controllers: [IreferProductsController],
  providers: [IreferProductsService],
  exports: [IreferProductsService],
})
export class IreferProductsModule {}

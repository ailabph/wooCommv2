import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IreferVendorsService } from './irefer-vendors.service';
import { IreferVendorsController } from './irefer-vendors.controller';
import { Vendor, VendorSchema } from '../schemas/irefer/vendors.schema';
import { UtilitiesModule } from '../utilities/utilities.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Vendor.name, schema: VendorSchema }],
      'irefer',
    ),
    UtilitiesModule,
  ],
  controllers: [IreferVendorsController],
  providers: [IreferVendorsService],
  exports: [IreferVendorsService],  
})
export class IreferVendorsModule {}

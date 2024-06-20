import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IreferReferralController } from './irefer-referral.controller';
import { IreferReferralService } from './irefer-referral.service';
import { Referral, ReferralSchema } from '../schemas/irefer/referral.schema';
import { UtilitiesModule } from '../utilities/utilities.module';
import { IreferUserSubscriptionModule } from '../irefer-user-subscription/irefer-user-subscription.module';
import { IreferVendorsModule } from '../irefer-vendors/irefer-vendors.module';
import { IreferUsersModule } from '../irefer-users/irefer-users.module';
import { ProductModule } from '../product/product.module';
import { IreferProductsModule } from '../irefer-products/irefer-products.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Referral.name, schema: ReferralSchema }],
      'irefer',
    ),
    UtilitiesModule,
    IreferUserSubscriptionModule,
    IreferVendorsModule,
    IreferUsersModule,
    IreferProductsModule,
    ProductModule,
  ],
  controllers: [IreferReferralController],
  providers: [IreferReferralService],
  exports: [IreferReferralService]
})
export class IreferReferralModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralsService } from './referrals.service';
import { ReferralsController } from './referrals.controller';
import { Referal, ReferalSchema } from '../schemas/woocommerce-integration/tbl_referals.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referal.name, schema: ReferalSchema },
    ], 'irefer-shopify-integration'),
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService],
})
export class ReferralsModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Referal } from '../schemas/woocommerce-integration/tbl_referals.schema';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel(Referal.name, 'irefer-shopify-integration')
    private referalKeyModel: Model<Referal>,
  ) {}

  async addReferrer(referalCode: string, storeUrl: string, productId: string, recId: string, variant: string, ip: string): Promise<string> {
    const cartData = {
      referal_code: referalCode,
      productid: productId, 
      variant: variant,
      ip: ip
    };
    
    const existingReferal = await this.referalKeyModel.findOne(cartData).exec();
    
    if (existingReferal) {
      return "Already";
    } else {
      const date = new Date();
      const newReferal = new this.referalKeyModel({
        referal_code: referalCode,
        store_url: storeUrl,
        productid: productId,
        variant: variant, 
        rec_id: recId,
        ip: ip,
        date: date
      });
      await newReferal.save();
      return "Added";
    }
  }

  async listReferals(referalCode: string): Promise<Referal[]> {
    const referals = await this.referalKeyModel
      .find({ referal_code: referalCode })
      .exec();
    if (referals.length > 0) {
      return referals;
    } else {
      throw new Error('Not found');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor_Key } from '../schemas/woocommerce-integration/tbl_vendor.schema';

@Injectable()
export class KeyRepository {
  constructor(
    @InjectModel(Vendor_Key.name, 'irefer-shopify-integration')
    private vendorKeyModel: Model<Vendor_Key>,
  ) {}

  async getKeys(): Promise<Vendor_Key[]> {
    return this.vendorKeyModel.find().exec();
  }

  private async createKey(key: Vendor_Key): Promise<Vendor_Key> {
    try {
      const newKey = new this.vendorKeyModel(key);
      return newKey.save();
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdateKey(keyData: Vendor_Key): Promise<string> {
    try {
      const existingKey = await this.vendorKeyModel
        .findOne({ shop: keyData.shop })
        .exec();
      if (existingKey) {
        await this.vendorKeyModel
          .findOneAndUpdate({ shop: keyData.shop }, keyData, { new: true })
          .exec();
        return 'Update Keys';
      } else {
        await this.createKey(keyData);
        return 'Added';
      }
    } catch (error) {
      console.log('Key Repository error: ', error);
      return 'No Data Found';
    }
  }
}

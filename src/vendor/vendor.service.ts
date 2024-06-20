import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor_Key } from '../schemas/woocommerce-integration/tbl_vendor.schema';
import axios from 'axios';
import { Vendor } from '../types/vendor';
import { VendorNotFoundException } from '../common/errors/custom-errors';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class VendorService {
  constructor(
    // eslint-disable-next-line camelcase
    @InjectModel(Vendor_Key.name, 'irefer-shopify-integration')
    private vendorKeyModel: Model<Vendor_Key>,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  async getProductData(storeUrl: string, productId: string): Promise<any> {
    console.log('storeUrl:', storeUrl, 'productId:', productId);
    const vendorData = await this.vendorKeyModel
      .findOne({ shop: storeUrl })
      .exec();
    console.log('vendorData:', vendorData);

    if (vendorData) {
      // eslint-disable-next-line camelcase
      const { consumer_key, consumer_secret } = vendorData;

      // eslint-disable-next-line camelcase
      if (!consumer_key || !consumer_secret) {
        console.error('Consumer key or secret not found');
        throw new Error('Consumer key or secret not found');
      }

      const url = `https://${storeUrl}/wp-json/wc/v2/products/${productId}`;
      console.log('url:', url);
      console.log('consumer_key:', consumer_key);
      console.log('consumer_secret:', consumer_secret);

      try {
        const response = await axios.get(url, {
          auth: {
            // eslint-disable-next-line camelcase
            username: consumer_key,
            // eslint-disable-next-line camelcase
            password: consumer_secret,
          },
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'WooCommerce API Client-Python/1.2.1',
          },
        });

        if (typeof response.data === 'object' && response.data !== null) {
          return response.data;
        } else {
          console.error('Invalid response json data');
          console.error('...retrying to rebuld json data');
          const divider = '{"id":' + productId;
          let rebuiltJson = response.data.split(divider)[1];
          rebuiltJson = divider + rebuiltJson;
          console.log('rebuiltJson:', rebuiltJson);
          return JSON.parse(rebuiltJson);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        throw error;
      }
    } else {
      console.error('Vendor data not found');
      throw new Error('Vendor data not found');
    }

    return {};
  }

  async addOrUpdateVendor(
    consumerKey: string,
    storeUrl: string,
    consumerSecret: string,
  ): Promise<string> {
    const vendorData = await this.vendorKeyModel
      .findOne({ shop: storeUrl })
      .exec();

    if (vendorData) {
      vendorData.consumer_key = consumerKey;
      vendorData.consumer_secret = consumerSecret;
      vendorData.set('updated_at', new Date());

      await vendorData.save();
      return 'Update Keys';
    } else {
      const newVendor = new this.vendorKeyModel({
        consumer_key: consumerKey,
        shop: storeUrl,
        consumer_secret: consumerSecret,
        created_at: new Date(),
      });
      await newVendor.save();
      return 'Added';
    }
  }

  async getByStoreUrl(storeUrl: string): Promise<Vendor> {
    console.log('getVendorData: called with storeUrl:', storeUrl);
    const extractedStoreUrl = this.utilitiesService.getDomainFromUrl(storeUrl);
    console.log('getVendorData: extracted store URL:', extractedStoreUrl);

    const vendor: Vendor | null = await this.vendorKeyModel
      .findOne({ shop: extractedStoreUrl })
      .exec();

    if (!vendor) {
      console.error('getVendorData: vendor not found for store URL:', storeUrl);
      throw new VendorNotFoundException(
        'getVendorData: vendor not found for store URL: ' + storeUrl,
      );
    } else {
      console.log('getVendorData: vendor found key ', vendor.consumer_key);
      return vendor;
    }
  }

  async getByStoreUrlStrict(storeUrl: string): Promise<Vendor> {
    try {
      const vendor = await this.getByStoreUrl(storeUrl);
      if (!vendor) {
        throw new VendorNotFoundException(
          `Vendor not found for store URL: ${storeUrl}`,
        );
      }
      return vendor;
    } catch (error) {
      console.error(
        'getByStoreUrlStrict: unable to retrieve vendor, error:' +
          error.message,
      );
      throw new VendorNotFoundException(
        `Vendor not found for store URL: ${storeUrl}`,
      );
    }
  }
}

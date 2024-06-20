import {Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor_Key } from '../schemas/woocommerce-integration/tbl_vendor.schema';
import { KeyRepository } from './key.repository';
import { VendorKeyType } from '../types/vendor-key-type';
import { UtilitiesService } from '../utilities/utilities.service';
import { plainToInstance } from 'class-transformer';
import { VendorKeyTypeDto } from '../types/vendor-key-type.dto';
import { InvalidArgumentException } from '../common/errors/custom-errors';
import { KeyAddUpdateReturnType } from '../types/key-add-update-return-type';
import { undefined } from 'io-ts';

@Injectable()
export class KeyService {
  constructor(
    @InjectModel(Vendor_Key.name, 'irefer-shopify-integration')
    private vendorKeyModel: Model<Vendor_Key>,
    private readonly keyRepository: KeyRepository,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  async getKeys(devKey: string): Promise<Vendor_Key[]> {
    console.log('getKeys: retrieving all vendor keys...');
    if (devKey !== this.utilitiesService.envDeveloperKey()) {
      throw new UnauthorizedException('Invalid Developer Key');
    }
    return await this.vendorKeyModel.find().exec();
  }

  async getKeyByShop(shop: string): Promise<Vendor_Key | null> {
    console.log(`getKeyByShop: retrieving vendor key for shop: ${shop}...`);
    shop = this.utilitiesService.removeHttpProtocol(shop);
    try {
      const existingVendorKey = await this.vendorKeyModel
        .findOne({ shop: shop })
        .exec();
      if (!existingVendorKey) return null;
    } catch (error) {
      console.error('getKeyByShop: Error fetching vendor key by shop:');
      return null;
    }
  }

  async createKey(vendorKey: unknown): Promise<Vendor_Key> {
    console.log('createKey: creating a new vendor key...');

    let decodedVendorKey: VendorKeyType =
      this.utilitiesService.decodeVendorKeyData(vendorKey);
    decodedVendorKey = this.validateVendorKey(decodedVendorKey);

    const checkExistingVendorKey = await this.getKeyByShop(
      decodedVendorKey.shop,
    );
    if (checkExistingVendorKey) {
      console.log(
        `Vendor key already exists with shop: ${decodedVendorKey.shop}`,
      );
      throw new InvalidArgumentException(
        'Vendor key already exists with shop: ' + decodedVendorKey.shop,
      );
    }

    console.log(
      `createKey: saving new vendor key for shop: ${decodedVendorKey.shop}...`,
    );
    const newVendorKey = new this.vendorKeyModel(decodedVendorKey);
    await newVendorKey.save();
    console.log(
      `createKey: new vendor key saved for shop: ${decodedVendorKey.shop}`,
    );

    return newVendorKey;
  }

  async updateKey(vendorKey: unknown): Promise<Vendor_Key> {
    console.log('updateKey: updating vendor key...');

    let decodedVendorKey: VendorKeyType =
      this.utilitiesService.decodeVendorKeyData(vendorKey);
    decodedVendorKey = this.validateVendorKey(decodedVendorKey);

    const existingVendorKey = await this.getKeyByShop(decodedVendorKey.shop);

    if (!existingVendorKey) {
      throw new InvalidArgumentException('Vendor key not found');
    }

    let hasChanges: boolean = false;
    if (existingVendorKey.consumer_key !== decodedVendorKey.consumer_key) {
      existingVendorKey.consumer_key = decodedVendorKey.consumer_key;
      hasChanges = true;
    }
    if (
      existingVendorKey.consumer_secret !== decodedVendorKey.consumer_secret
    ) {
      existingVendorKey.consumer_secret = decodedVendorKey.consumer_secret;
      hasChanges = true;
    }

    if (hasChanges) {
      console.log('updateKey: saving changes to vendor key...');
      existingVendorKey.set('updated_at', new Date());
      await existingVendorKey.save();
    } else {
      console.log(
        `updateKey: no changes detected in vendor key for shop: ${decodedVendorKey.shop}`,
      );
    }

    return existingVendorKey;
  }

  async createOrUpdateKey(data: unknown): Promise<KeyAddUpdateReturnType> {
    console.log('createOrUpdateKey: creating or updating vendor key...');
    const vendorKey: VendorKeyType =
      this.utilitiesService.decodeVendorKeyData(data);

    const existingVendorKey = await this.getKeyByShop(vendorKey.shop);

    if (!existingVendorKey) {
      console.log(
        `Vendor key not found for shop: ${vendorKey.shop}, adding...`,
      );
      const newVendorKey = await this.createKey(vendorKey);
      return { keyData: newVendorKey, message: 'Added' };
    } else {
      console.log(`Vendor key found for shop: ${vendorKey.shop}, updating...`);
      const updatedVendorKey = await this.updateKey(vendorKey);
      return { keyData: updatedVendorKey, message: 'Update Keys' };
    }
  }

  validateVendorKey(vendorKey: VendorKeyType): VendorKeyType {
    console.log('validateVendorKey: validating vendor data...');
    if (vendorKey.consumer_key === '') {
      throw new InvalidArgumentException('Consumer key is required');
    }

    if (vendorKey.consumer_secret === '') {
      throw new InvalidArgumentException('Consumer key is required');
    }

    vendorKey.shop = this.utilitiesService.removeHttpProtocol(vendorKey.shop);

    return vendorKey;
  }
}

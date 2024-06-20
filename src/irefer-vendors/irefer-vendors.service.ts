import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from '../schemas/irefer/vendors.schema';
import { VendorNotFoundException } from '../common/errors/custom-errors';
import {UtilitiesService} from "../utilities/utilities.service";

@Injectable()
export class IreferVendorsService {
  constructor(
    @InjectModel(Vendor.name, 'irefer')
    private vendorModel: Model<Vendor>,
    private ireferUtilityService: UtilitiesService,
  ) {}

  async getVendorByDomain(domain: string): Promise<Vendor | null> {
    console.log('getVendorByDomain: Received domain:', domain);
    domain = this.ireferUtilityService.assertString(domain, true);

    // Strip domain of prefix like https://, http://, or www.
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    console.log('getVendorByDomain: Stripped domain:', domain);

    const vendor = await this.vendorModel
      .findOne({ domain: { $regex: domain, $options: 'i' } })
      .exec();

    if (vendor) {
      console.log('getVendorByDomain: Vendor found:', vendor);
    } else {
      console.log('getVendorByDomain: No vendor found for domain:', domain);
    }

    return vendor ?? null;
  }

  async getVendorByDomainStrict(domain: string): Promise<Vendor> {
    domain = this.ireferUtilityService.assertString(domain, true);
    const vendor = await this.getVendorByDomain(domain);
    if (!vendor) {
      throw new VendorNotFoundException(
        `Vendor not found for domain: ${domain}`,
      );
    }
    return vendor;
  }

  async getVendorById(id: string): Promise<Vendor | null> {
    console.log('getVendorById: Received ID:', id);
    id = this.ireferUtilityService.assertString(id, true);
    try {
      const vendor = await this.vendorModel.findById(id).exec();
      if (vendor) {
        console.log('getVendorById: Vendor found:', vendor);
      } else {
        console.log('getVendorById: No vendor found for ID:', id);
      }
      return vendor ?? null;
    } catch (error) {
      console.error('getVendorById: Error fetching vendor by ID:', id, error);
      return null;
    }
  }

  async getVendorByIdStrict(id: string): Promise<Vendor> {
    const vendor = await this.getVendorById(id);
    if (!vendor) {
      throw new VendorNotFoundException(`Vendor not found for id: ${id}`);
    }
    return vendor;
  }

  async getVendorByUserId(userId: string): Promise<Vendor | null> {
    console.log('getVendorByUserId: Received user ID:', userId);
    userId = this.ireferUtilityService.assertString(userId, true);
    const vendor = await this.vendorModel.findOne({ user_id: userId }).exec();
    if (vendor) {
      console.log('getVendorByUserId: Vendor found:', vendor);
    } else {
      console.log('getVendorByUserId: No vendor found for user ID:', userId);
    }
    return vendor ?? null;
  }

  async getVendorByUserIdStrict(userId: string): Promise<Vendor> {
    const vendor = await this.getVendorByUserId(userId);
    if (!vendor) {
      throw new VendorNotFoundException(
        `Vendor not found for user ID: ${userId}`,
      );
    }
    return vendor;
  }
}

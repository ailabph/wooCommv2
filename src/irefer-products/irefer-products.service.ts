import { Injectable } from '@nestjs/common';
import {
  ProductNotFoundException,
  InvalidProductIdException,
} from '../common/errors/custom-errors';

import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Product } from '../schemas/irefer/products.schema';
import { ProductInfo } from '../types/product-info';
import { Vendor } from '../schemas/irefer/vendors.schema';
import { Referral } from '../schemas/irefer/referral.schema';
import { UtilitiesService } from '../utilities/utilities.service';
import { VendorService } from '../vendor/vendor.service';
import { IreferVendorsService } from '../irefer-vendors/irefer-vendors.service';
import { ProductInfoDto } from '../types/product-info.dto';

@Injectable()
export class IreferProductsService {
  constructor(
    @InjectModel(Product.name, 'irefer')
    private productModel: Model<Product>,
    private utilitiesService: UtilitiesService,
    private vendorService: VendorService,
    private ireferVendorService: IreferVendorsService,
  ) {}

  //region GETTERS
  async getProductByProductIdAndStoreUrl(
    productId: string | number,
    storeUrl: string,
  ): Promise<Product | null> {
    productId = this.utilitiesService.getNumber(productId, true, true);

    // remove the last slash from the storeUrl, example: https://example.com/ -> https://example.com
    storeUrl = storeUrl.endsWith('/') ? storeUrl.slice(0, -1) : storeUrl;

    const product = await this.productModel
      .findOne({ product_id: productId, store_url: storeUrl })
      .exec();
    return product ?? null;
  }

  async getProductByProductIdAndStoreUrlStrict(
    productId: string | number,
    storeUrl: string,
  ): Promise<Product> {
    const product = await this.getProductByProductIdAndStoreUrl(
      productId,
      storeUrl,
    );
    if (!product) {
      throw new ProductNotFoundException(
        `Product not found with productId: ${productId}`,
      );
    }
    return product;
  }

  async getProductById(id: string): Promise<Product | null> {
    let product: Document<unknown, NonNullable<unknown>, Product> &
      Product & { _id: Types.ObjectId };
    try {
      product = await this.productModel.findById(id).exec();
    } catch (error) {
      return null;
    }
    return product ?? null;
  }

  async getProductByIdStrict(id: string): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) {
      throw new ProductNotFoundException(`Product not found with id: ${id}`);
    }
    return product;
  }

  async getProductsByVendorId(vendorId: string): Promise<Product[]> {
    const products = await this.productModel
      .find({ vendor_id: vendorId })
      .exec();
    return products;
  }

  async getProductsByUserId(userId: string): Promise<Product[]> {
    const products = await this.productModel.find({ user_id: userId }).exec();
    return products;
  }

  async getProductsByDomain(domain: string): Promise<Product[]> {
    // Strip http:// or https:// from domain
    domain = domain.replace(/^https?:\/\//, '');

    const products = await this.productModel
      .find({ store_url: { $regex: domain, $options: 'i' } })
      .exec();
    return products;
  }

  async getProductByVendorIdAndUserIdAndProductId(
    vendor_id: string,
    user_id: string,
    productId: string,
  ): Promise<Product | null> {
    console.log(
      `getProductByVendorIdAndUserIdAndProductId: Searching for product with vendor_id: ${vendor_id}, user_id: ${user_id}, product_id: ${productId}`,
    );
    try {
      const product = await this.productModel
        .findOne({ vendor_id, user_id, product_id: productId })
        .exec();
      if (product) {
        console.log(
          `getProductByVendorIdAndUserIdAndProductId: Found product with vendor_id: ${vendor_id}, user_id: ${user_id}, product_id: ${productId}`,
        );
      } else {
        console.log(
          `getProductByVendorIdAndUserIdAndProductId: No product found with vendor_id: ${vendor_id}, user_id: ${user_id}, product_id: ${productId}`,
        );
      }
      return product ?? null;
    } catch (error) {
      console.error(
        `getProductByVendorIdAndUserIdAndProductId: Error occurred while searching for product with vendor_id: ${vendor_id}, user_id: ${user_id}, product_id: ${productId}`,
        error,
      );
      return null;
    }
  }

  async getProductByVendorIdAndUserIdAndProductIdStrict(
    vendor_id: string,
    user_id: string,
    productId: string,
  ): Promise<Product> {
    const product = await this.getProductByVendorIdAndUserIdAndProductId(
      vendor_id,
      user_id,
      productId,
    );
    if (!product) {
      throw new ProductNotFoundException(
        `Product not found with vendorId: ${vendor_id}, userId: ${user_id}, productId: ${productId}`,
      );
    }
    return product;
  }

  async getByProductUrl(productUrl: string): Promise<Product | null> {
    console.log(`getByProductUrl: Received productUrl: ${productUrl}`);

    const vendorDomain = this.utilitiesService.getDomainFromUrl(productUrl);
    console.log(`getByProductUrl: Extracted vendorDomain: ${vendorDomain}`);

    const vendor =
      await this.ireferVendorService.getVendorByDomain(vendorDomain);
    if (vendor === null) {
      console.log(
        `getByProductUrl: No vendor found for domain: ${vendorDomain}`,
      );
      return null;
    }
    console.log(`getByProductUrl: Found vendor: ${vendor.id}`);

    let processedProductUrl =
      this.utilitiesService.removeHttpProtocol(productUrl);
    console.log(
      `getByProductUrl: Processed productUrl (removed HTTP protocol): ${processedProductUrl}`,
    );

    processedProductUrl =
      this.utilitiesService.removeIReferReferralCode(processedProductUrl);
    console.log(
      `getByProductUrl: Processed productUrl (removed referral code): ${processedProductUrl}`,
    );

    processedProductUrl =
      this.utilitiesService.removeUrlArguments(processedProductUrl);
    processedProductUrl = processedProductUrl + '/?ireferal_code=';

    const product = await this.productModel
      .findOne({
        vendor_id: vendor.id,
        product_referal_url: processedProductUrl,
      })
      .exec();

    if (product) {
      console.log(
        `getByProductUrl: Found product with vendor_id: ${vendor.id} and product_referal_url: ${processedProductUrl}`,
      );
    } else {
      console.log(
        `getByProductUrl: No product found with vendor_id: ${vendor.id} and product_referal_url: ${processedProductUrl}`,
      );
    }

    return product ?? null;
  }

  //endregion GETTERS

  async addProduct(
    product: ProductInfoDto,
    vendor: Vendor,
    user_id: string,
    rec_id: string = '',
    referral_url: string = '',
    custom_image: string = '',
    custom_video: string = '',
    custom_description: string = '',
  ): Promise<Product> {
    console.log(
      `addProduct: Adding product with product_id: ${product.id}, vendor_id: ${vendor.id}, user_id: ${user_id}`,
    );
    const newProduct = new this.productModel({
      title: this.utilitiesService.removeHtmlTags(product.name ?? '', false),
      product_title: this.utilitiesService.removeHtmlTags(
        product.name ?? '',
        false,
      ),
      product_id: product.id,
      product_image: product.product_image ?? '',
      product_referal_url: referral_url,
      store_url: this.utilitiesService.addHttpProtocol(vendor.domain),
      product_description: this.utilitiesService.removeHtmlTags(
        product.description,
        false,
      ),
      user_id: user_id,
      rec_id: rec_id,
      vendor_id: vendor.id,
      custom_image: custom_image,
      custom_video: custom_video,
      custom_description: custom_description,
    });

    const savedProduct = await newProduct.save();
    console.log(
      `addProduct: Successfully added product with id: ${savedProduct.id}`,
    );
    return savedProduct;
  }
}

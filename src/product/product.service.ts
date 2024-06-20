import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor_Key } from '../schemas/woocommerce-integration/tbl_vendor.schema';
import { ProductInfo } from '../types/product-info';
import { ProductExternalService } from './product.external';
import { ProductWooType } from '../types/product-woo-type';
import { ProductMagento } from '../types/product-magento';
import { VendorService } from '../vendor/vendor.service';
import { plainToClass } from 'class-transformer';
import { UtilitiesService } from '../utilities/utilities.service';
import { IreferProductsService } from '../irefer-products/irefer-products.service';
import { undefined } from 'io-ts';
import { IreferVendorsService } from '../irefer-vendors/irefer-vendors.service';
import { ProductInfoDto } from '../types/product-info.dto';
import { WooProductV3Dto } from '../types/woo-prod-v3-type.dto';

@Injectable()
export class ProductService {
  constructor(
    // eslint-disable-next-line camelcase
    @InjectModel(Vendor_Key.name, 'irefer-shopify-integration')
    private vendorKeyModel: Model<Vendor_Key>,
    private readonly productExternalService: ProductExternalService,
    private readonly vendorService: VendorService,
    private readonly utilityService: UtilitiesService,
    private readonly ireferProductServices: IreferProductsService,
    private readonly ireferVendorServices: IreferVendorsService,
  ) {}

  async getProductData(storeUrl: string, productUrl: string) {
    console.log('storeUrl:', storeUrl, 'productUrl:', productUrl);

    const productSlugOrId = productUrl.split('/').pop();

    return await this.getProductInfoV2(storeUrl, productSlugOrId);
  }

  async isValidProductUrl(productUrl: string): Promise<boolean> {
    console.log(`isValidProductUrl: productUrl: ${productUrl}`);
    console.log(
      `isValidProductUrl: attempt to check if product url is valid via checking db first`,
    );
    const ireferProduct =
      await this.ireferProductServices.getByProductUrl(productUrl);
    if (ireferProduct) return true;

    console.log(
      `isValidProductUrl: attempt to check if product url is valid via checking external API`,
    );

    try {
      console.log(`isValidProductUrl: checking what e-com platform the url is`);
      const integrationVendor =
        await this.vendorService.getByStoreUrlStrict(productUrl);
      const platform: string =
        typeof integrationVendor.platform === 'string'
          ? integrationVendor.platform
          : 'woocommerce';
      console.log(`isValidProductUrl: platform found: ${platform}`);

      console.log(`isValidProductUrl: retrieving product slug`);
      const productSlug: string =
        this.utilityService.getProductSlug(productUrl);
      console.log(`isValidProductUrl: slug is ${productSlug}`);

      try {
      } catch (error) {
        console.log(`isValidProductUrl: error found, error: ${error.message}`);
        return false;
      }
      // if wp, get slug and check via wp api
      if (platform === 'woocommerce') {
        console.log(`isValidProductUrl: platform is woocommerce`);
        const productWoo = await this.productExternalService.getViaWooSlug(
          integrationVendor.shop,
          productSlug,
        );
        console.log(
          `isValidProductUrl: product found, product id: ${productWoo.id}`,
        );
        return true;
      }

      // if magento, get slug via api
      if (platform === 'magento') {
        console.log(`isValidProductUrl: platform is magento`);
        const productMagento =
          await this.productExternalService.getViaMagentoSlug(
            integrationVendor.shop,
            productSlug,
          );
        console.log(
          `isValidProductUrl: product found, product id: ${productMagento.id}`,
        );
        return true;
      }
    } catch (e) {
      console.log(`isValidProductUrl: not a valid url, error found`);
      return false;
    }
  }

  isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  async getViaWpPublicApiV2(storeUrl: string, productSlug: string) {
    try {
      const axiosProductWoo = await this.productExternalService.getViaWooSlug(
        storeUrl,
        productSlug,
      );
      return axiosProductWoo;
    } catch (error) {
      console.error('Error in getProductInfoByWpPublicApi:', error);
      throw error;
    }
  }

  async getViaWpAuthApiV3Manual(
    storeUrl: string,
    productId: string,
    consumer_key: string,
    consumer_secret: string,
  ) {}

  async getProductInfoInWp(storeUrl: string, productSlugOrId: string | number) {
    try {
      const axiosProductWoo =
        await this.productExternalService.getProductFromWoo(
          storeUrl,
          productSlugOrId,
        );
      return axiosProductWoo;
    } catch (error) {
      console.error(
        'Error in getProductInfoInWp, status_code and message:',
        error.response.status,
        error.response.data.message,
      );
      throw error;
    }
  }

  async getProductInfoByWpIReferPlugin(
    storeUrl: string,
    productSlugOrId: string | number,
  ): Promise<ProductWooType> {
    try {
      const axiosProductWoo =
        await this.productExternalService.getProductFromWooIRefer(
          storeUrl,
          productSlugOrId,
        );
      return axiosProductWoo.data;
    } catch (error) {
      console.error('Error in getProductInfoByWpIReferPlugin:', error);
      throw error;
    }
  }

  async getProductInfoByMagentoIReferPlugin(
    storeUrl: string,
    productSlugOrId: string | number,
  ) {
    try {
      return null;
      // const axiosProductWoo =
      //   await this.productExternalService.getProductFromMagento(
      //     storeUrl,
      //     productSlugOrId,
      //   );
      // return axiosProductWoo.data;
    } catch (error) {
      console.error('Error in getProductInfoByMagentoIReferPlugin:', error);
      throw error;
    }
  }

  async getProductInfoV2(
    storeUrl: string,
    productSlugOrId: string | number,
  ): Promise<ProductInfo> {
    // TODO: For implementation...

    return {
      description: '',
      id: '',
      name: '',
      price: 0,
      product_image: '',
      product_permalink: '',
      product_slug: '',
      short_description: '',
    };
  }

  async getProductInfoV3(productUrl: string): Promise<ProductInfoDto> {
    const vendorDomain = this.utilityService.getDomainFromUrl(productUrl);
    console.log(`getProductInfoV3: vendorDomain: ${vendorDomain}`);
    const vendor = await this.vendorService.getByStoreUrlStrict(vendorDomain);
    const platform: string =
      typeof vendor.platform === 'string' ? vendor.platform : 'woocommerce';
    console.log(`getProductInfoV3: platform ${platform}`);

    console.log(`getProductInfoV3: retrieving product slug`);
    const productSlug: string = this.utilityService.getProductSlug(productUrl);
    console.log(`getProductInfoV3: slug is ${productSlug}`);

    // if wp, get slug and check via wp api
    if (platform === 'woocommerce') {
      const productWoo = await this.productExternalService.getViaWooSlug(
        vendor.shop,
        productSlug,
      );
      console.log(
        `getProductInfoV3: product found, product id: ${productWoo.id}`,
      );

      const fullProdInfo = await this.getViaWooId(vendorDomain, productWoo.id);

      return {
        description: fullProdInfo.description,
        id: fullProdInfo.id + '',
        name: fullProdInfo.name,
        price: fullProdInfo.price,
        product_image:
          Array.isArray(fullProdInfo.images) && fullProdInfo.images.length > 0
            ? fullProdInfo.images[0].src
            : '',
        product_permalink: fullProdInfo.permalink,
        product_slug: fullProdInfo.slug,
        short_description: fullProdInfo.short_description,
      };
    }

    // if magento, get slug via api
    if (platform === 'magento') {
      const productMagento =
        await this.productExternalService.getViaMagentoSlug(
          vendor.shop,
          productSlug,
        );
      console.log(
        `getProductInfoV3: product found, product id: ${productMagento.id}`,
      );
      let prodImage = '';
      if (productMagento.images.length > 0) {
        prodImage = productMagento.images[0];
      }
      return {
        description: productMagento.description ?? '',
        id: productMagento.id + '',
        name: productMagento.name,
        price: productMagento.price ?? '',
        product_image: prodImage,
        product_permalink: productMagento.permalink ?? '',
        product_slug: productMagento.slug ?? '',
        short_description: productMagento.short_description ?? '',
      };
    }

    throw new NotImplementedException(
      `Platform: ${platform} not implemented for product retrieval`,
    );
  }

  convertDataToUniformDataStructure(
    apiProductData: ProductWooType | ProductMagento,
  ): ProductInfo {
    return {
      name: apiProductData.name,
      id: apiProductData.id + '',
      product_slug: apiProductData.slug,
      description: apiProductData.description,
      short_description: apiProductData.short_description,
      product_image: '',
      price: parseFloat(apiProductData.price),
      product_permalink: apiProductData.permalink,
    };
  }

  async getViaWooId(
    storeUrl: string,
    productId: string | number,
  ): Promise<WooProductV3Dto> {
    const vendorDomain = this.utilityService.getDomainFromUrl(storeUrl);
    console.log(`getViaWooId: vendorDomain: ${vendorDomain}`);
    const vendor = await this.vendorService.getByStoreUrlStrict(vendorDomain);
    return await this.productExternalService.getViaWooId(
      vendorDomain,
      productId,
      vendor.consumer_key,
      vendor.consumer_secret,
    );
  }
}

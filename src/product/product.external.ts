import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { VendorService } from '../vendor/vendor.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { plainToClass } from 'class-transformer';
import { WooProductDto } from '../types/woo-prod-type.dto';
import { WooProductV3Dto } from '../types/woo-prod-v3-type.dto';
import { MagentoProductDto } from '../types/magento-prod-type.dto';
import { WooProductsType } from '../types/woo-prod-type';

@Injectable()
export class ProductExternalService {
  constructor(
    private readonly vendorService: VendorService,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  async getViaWooSlug(
    storeUrl: string,
    productSlug: string,
  ): Promise<WooProductDto> {
    if (!storeUrl) {
      console.log('getProductFromWoo: Store URL is required');
      throw new BadRequestException('Store URL is required');
    }

    if (!productSlug || productSlug.trim() === '') {
      throw new BadRequestException('Product slug is required');
    }

    storeUrl = this.utilitiesService.getDomainFromUrl(storeUrl);

    const productDataUrl = this.utilitiesService.addHttpProtocol(
      `${storeUrl}/wp-json/wp/v2/product?slug=${productSlug}`,
    );
    console.log(
      'retrieve product from woo via slug, productDataUrl:',
      productDataUrl,
    );
    const response = await axios.get(productDataUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const products: WooProductsType =
      this.utilitiesService.getWooProductFromArray(response);

    if (products.length === 0) {
      throw new NotFoundException('Product not found for slug: ' + productSlug);
    }

    // Convert the plain object to the DTO
    return plainToClass(WooProductDto, products[0]);
  }

  async getViaWooId(
    storeUrl: string,
    productId: number | string,
    consumerKey: string,
    secretKey: string,
  ): Promise<WooProductV3Dto> {
    storeUrl = this.utilitiesService.getDomainFromUrl(storeUrl);
    productId = this.utilitiesService.getNumber(productId, true, true);
    const productDataUrl = this.utilitiesService.addHttpProtocol(
      `${storeUrl}/wp-json/wc/v3/products/${productId}`,
    );

    if (consumerKey === '') {
      throw new BadRequestException('Consumer key is required');
    }

    if (secretKey === '') {
      throw new BadRequestException('Secret key is required');
    }

    console.log(
      `getViaWooId: retrieving product from woo via ID: ${productId}`,
    );
    const response = await axios.get(productDataUrl, {
      auth: {
        username: consumerKey,
        password: secretKey,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WooCommerce API Client-Python/1.2.1',
      },
    });

    const productData = this.utilitiesService.getWooProductSingle(response);
    return plainToClass(WooProductV3Dto, productData);
  }

  async getProductFromWoo(storeUrl: string, productSlugOrId: string | number) {
    console.log(
      'getProductFromWoo: retrieving product from woo, storeUrl:',
      storeUrl,
      'productSlugOrId:',
      productSlugOrId,
    );
    if (!storeUrl) {
      throw new BadRequestException('Store URL is required');
    }

    if (typeof productSlugOrId === 'string' && productSlugOrId.trim() === '') {
      throw new BadRequestException('Product slug or ID is required');
    }

    let productId: number = 0;
    if (typeof productSlugOrId === 'number') {
      productId = productSlugOrId;
    }

    if (
      typeof productSlugOrId === 'string' &&
      !isNaN(Number(productSlugOrId))
    ) {
      console.log(
        'getProductFromWoo: detected that productSlugOrId is a string and is a number, converting to integer',
      );
      productId = parseInt(productSlugOrId, 10);
    }

    if (typeof productSlugOrId === 'string' && !(productId > 0)) {
      console.log(
        'getProductFromWoo: detected that productSlugOrId is a string and is not a number, attempting to retrieve product from woo via slug',
      );
      return await this.getViaWooSlug(storeUrl, productSlugOrId);
    }

    if (productId < 1 || isNaN(productId)) {
      console.log(
        'getProductFromWoo: Product ID must be greater than 0, productId:' +
          productId,
      );
      throw new BadRequestException(
        'Product ID must be greater than 0, productId:' + productId,
      );
    }

    const vendorData = await this.vendorService.getByStoreUrlStrict(storeUrl);
    const { consumer_key, consumer_secret } = vendorData;

    console.log(
      `getProductFromWoo: retrieving product id ${productId} from store ${storeUrl} with consumer_key ${consumer_key}`,
    );

    const productDataUrl = this.utilitiesService.addHttpProtocol(
      `${storeUrl}/wp-json/wc/v3/products/${productId}`,
    );
    console.log(
      `getProductFromWoo: retrieving data from axios url: ${productDataUrl}`,
    );
    return await axios.get(productDataUrl, {
      auth: {
        username: consumer_key,
        password: consumer_secret,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WooCommerce API Client-Python/1.2.1',
      },
    });
  }

  async getProductFromWooIRefer(
    storeUrl: string,
    productSlugOrId: string | number,
  ): Promise<AxiosResponse> {
    if (!storeUrl) {
      throw new BadRequestException('Store URL is required');
    }

    if (typeof productSlugOrId === 'string' && productSlugOrId.trim() === '') {
      throw new BadRequestException('Product slug or ID is required');
    }

    if (
      typeof productSlugOrId === 'string' &&
      !isNaN(Number(productSlugOrId))
    ) {
      productSlugOrId = parseInt(productSlugOrId, 10);
    }

    if (typeof productSlugOrId === 'number' && productSlugOrId < 1) {
      throw new BadRequestException('Product ID must be greater than 0');
    }

    const domainUrl = this.utilitiesService.getDomainFromUrl(storeUrl);

    const slugOrId = typeof productSlugOrId === 'string' ? 'slug' : 'id';
    const productDataUrl = `https://${domainUrl}/wp-json/irefer/v2/get-product/?${slugOrId}=${productSlugOrId}`;
    return await axios.get(productDataUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WooCommerce API Client-Python/1.2.1',
      },
    });
  }

  async getViaMagentoSlug(
    storeUrl: string,
    productSlug: string,
  ): Promise<MagentoProductDto> {
    storeUrl = this.utilitiesService.assertString(storeUrl, true, 'storeUrl');
    productSlug = this.utilitiesService.assertString(storeUrl, true), 'productSlug';

    const productDataUrl = this.utilitiesService.addHttpProtocol(
      `${storeUrl}/rest/V1/irefer/product/slug/${productSlug}`,
    );

    const response = await axios.get(productDataUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      date_created: '',
      date_modified: '',
      description: '',
      id: 0,
      images: [],
      name: '',
      permalink: '',
      price: 0,
      regular_price: 0,
      sale_price: 0,
      short_description: '',
      sku: '',
      slug: '',
      status: '',
      type: '',
    };
  }
}

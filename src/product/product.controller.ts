import {
  BadRequestException,
  Controller,
  Get,
  Query,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from '../auth/guards/public.decorator';
import { ProductExternalService } from './product.external';
import { ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WooProductDto } from '../types/woo-prod-type.dto';
import { InvalidApiResponseType } from '../common/errors/custom-errors';
import { WooProductV3Dto } from '../types/woo-prod-v3-type.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productExternal: ProductExternalService,
  ) {}

  @Public()
  @Get('/refer_product')
  async referProduct(
    @Query('storeurl') storeUrl: string,
    @Query('producturl') productUrl: string,
  ) {
    const productData = await this.productService.getProductData(
      storeUrl,
      productUrl,
    );
    return productData;
  }

  @Public()
  @Get('/is-valid-product-url')
  @ApiQuery({
    name: 'producturl',
    required: true,
    description: 'The URL of the product to validate',
    example: 'https://example.com/product/sample-product',
  })
  @ApiResponse({
    status: 200,
    description: 'Valid product URL',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The product URL is missing or invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. The product with the given URL was not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async isValidProductUrl(
    @Query('producturl') productUrl: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const isValid = await this.productService.isValidProductUrl(productUrl);
      if (isValid) {
        return { statusCode: 200, message: 'Valid product URL' };
      } else {
        throw new NotFoundException('Product URL not found');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        console.error('Unexpected error:', error.message);
        throw new InternalServerErrorException(
          'An unexpected error occurred. Please try again later.',
        );
      }
    }
  }

  @Public()
  @Get('/product-via-slug-wp-api')
  async getProductInfoBySlug(
    @Query('storeurl') storeUrl: string,
    @Query('productslug') productSlug: string,
  ) {
    const productData = await this.productService.getProductInfoV2(
      storeUrl,
      productSlug,
    );
    return productData;
  }

  @Public()
  @Get('/product-via-woo-api')
  async getProductFromWoo(
    @Query('storeurl') storeUrl: string,
    @Query('productid') productId: string,
  ) {
    try {
      const axiosProductData = await this.productExternal.getProductFromWoo(
        storeUrl,
        productId,
      );
      return axiosProductData;
    } catch (error) {
      console.log(error);
      console.error(
        'Error retrieving product from WooCommerce API:',
        error.message,
      );
      throw new BadRequestException(
        'Failed to retrieve product from WooCommerce API',
      );
    }
  }

  @Public()
  @Get('/proxy-woo-api-get-product-via-slug')
  @ApiQuery({
    name: 'storeurl',
    required: true,
    description: 'The URL of the WooCommerce store',
    example: 'https://example.com',
  })
  @ApiQuery({
    name: 'productslug',
    required: true,
    description: 'The slug of the product to retrieve',
    example: 'sample-product',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product data',
    type: WooProductDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The store URL or product slug is missing or invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. The product with the given slug was not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async proxyWooApiGetProductViaSlug(
    @Query('storeurl') storeUrl: string,
    @Query('productslug') productSlug: string,
  ): Promise<WooProductDto> {
    try {
      return await this.productExternal.getViaWooSlug(storeUrl, productSlug);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof InvalidApiResponseType) {
        throw new BadRequestException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        console.error('Unexpected error:', error.message);
        throw new InternalServerErrorException(
          'An unexpected error occurred. Please try again later.',
        );
      }
    }
  }

  @Public()
  @Get('/proxy-woo-api-get-product-via-id')
  @ApiQuery({
    name: 'storeurl',
    required: true,
    description: 'The URL of the WooCommerce store',
    example: 'https://example.com',
  })
  @ApiQuery({
    name: 'productid',
    required: true,
    description: 'The ID of the product to retrieve',
    example: '123',
  })
  @ApiQuery({
    name: 'consumerkey',
    required: true,
    description: 'The consumer key for WooCommerce API',
    example: 'ck_abc123',
  })
  @ApiQuery({
    name: 'secretkey',
    required: true,
    description: 'The secret key for WooCommerce API',
    example: 'cs_xyz456',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product data',
    type: WooProductV3Dto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The store URL, product ID, consumer key, or secret key is missing or invalid.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. The product with the given ID was not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  async proxyWooApiGetProductViaId(
    @Query('storeurl') storeUrl: string,
    @Query('productid') productId: string,
    @Query('consumerkey') consumerKey: string,
    @Query('secretkey') secretKey: string,
  ): Promise<WooProductV3Dto> {
    try {
      return await this.productExternal.getViaWooId(
        storeUrl,
        productId,
        consumerKey,
        secretKey,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof InvalidApiResponseType) {
        throw new BadRequestException(error.message);
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        console.error('Unexpected error:', error.message);
        throw new InternalServerErrorException(
          'An unexpected error occurred. Please try again later.',
        );
      }
    }
  }

  @Public()
  @Get('/proxy-magento-api-get-product-via-slug')
  async proxyMagentoApiGetProductViaSlug(
    @Query('storeurl') storeUrl: string,
    @Query('productslug') productSlug: string,
  ) {
    try {
      return await this.productExternal.getViaMagentoSlug(storeUrl, productSlug);
    } catch (error) {
      console.error('Unexpected error:', error.message);
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again later.',
      );
    }
  }
}

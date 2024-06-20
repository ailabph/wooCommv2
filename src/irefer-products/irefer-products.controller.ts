import {
  Controller,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  ProductNotFoundException,
  InvalidProductIdException,
} from '../common/errors/custom-errors';
import { IreferProductsService } from './irefer-products.service';
import { Public } from '../auth/guards/public.decorator';
import { Product } from '../schemas/irefer/products.schema';

@Controller('irefer-products')
export class IreferProductsController {
  constructor(private readonly ireferProductsService: IreferProductsService) {}

  @Public()
  @Get('/product-by-store-product-id')
  @ApiOperation({ summary: 'Retrieve a product using its productId' })
  @ApiQuery({
    name: 'productId',
    required: true,
    type: String,
    description: 'The ID of the product to retrieve',
  })
  @ApiQuery({
    name: 'storeUrl',
    required: true,
    type: String,
    description: 'Store url',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the product',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid productId provided' })
  @ApiResponse({
    status: 404,
    description: 'No product found with the provided productId',
  })
  async getProduct(
    @Query('productId') productId: string,
    @Query('storeUrl') storeUrl: string,
  ) {
    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    try {
      return await this.ireferProductsService.getProductByProductIdAndStoreUrlStrict(
        productId,
        storeUrl,
      );
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('/product-by-id')
  @ApiOperation({ summary: 'Retrieve a product using its unique ID' })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    description: 'The unique ID of the product to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the product',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Invalid ID provided' })
  @ApiResponse({
    status: 404,
    description: 'No product found with the provided ID',
  })
  async getProductById(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    try {
      return await this.ireferProductsService.getProductByIdStrict(id);
    } catch (error) {
      if (error instanceof InvalidProductIdException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('/products-by-vendor')
  @ApiOperation({ summary: 'Retrieve products using vendorId' })
  @ApiQuery({
    name: 'vendorId',
    required: true,
    type: String,
    description: 'The ID of the vendor to retrieve products for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Invalid vendorId provided' })
  @ApiResponse({
    status: 404,
    description: 'No products found for the provided vendorId',
  })
  async getProductsByVendorId(@Query('vendorId') vendorId: string) {
    if (!vendorId) {
      throw new BadRequestException('vendorId is required');
    }

    try {
      const products =
        await this.ireferProductsService.getProductsByVendorId(vendorId);
      if (products.length === 0) {
        throw new ProductNotFoundException(
          `No products found for vendorId: ${vendorId}`,
        );
      }
      return products;
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('/products-by-user')
  @ApiOperation({ summary: 'Retrieve products using userId' })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'The ID of the user to retrieve products for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Invalid userId provided' })
  @ApiResponse({
    status: 404,
    description: 'No products found for the provided userId',
  })
  async getProductsByUserId(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    try {
      const products =
        await this.ireferProductsService.getProductsByUserId(userId);
      if (products.length === 0) {
        throw new ProductNotFoundException(
          `No products found for userId: ${userId}`,
        );
      }
      return products;
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('/products-by-domain')
  @ApiOperation({ summary: 'Retrieve products using domain' })
  @ApiQuery({
    name: 'domain',
    required: true,
    type: String,
    description: 'The domain to retrieve products for',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the products',
    type: [Product],
  })
  @ApiResponse({ status: 400, description: 'Invalid domain provided' })
  @ApiResponse({
    status: 404,
    description: 'No products found for the provided domain',
  })
  async getProductsByDomain(@Query('domain') domain: string) {
    if (!domain) {
      throw new BadRequestException('domain is required');
    }

    try {
      const products =
        await this.ireferProductsService.getProductsByDomain(domain);
      if (products.length === 0) {
        throw new ProductNotFoundException(
          `No products found for domain: ${domain}`,
        );
      }
      return products;
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('/product-by-vendor-user-product')
  @ApiOperation({
    summary: 'Retrieve a product using vendorId, userId, and productId',
  })
  @ApiQuery({
    name: 'vendorId',
    required: true,
    type: String,
    description: 'The ID of the vendor',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'The ID of the user',
  })
  @ApiQuery({
    name: 'productId',
    required: true,
    type: String,
    description: 'The ID of the product',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the product',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid vendorId, userId, or productId provided',
  })
  @ApiResponse({
    status: 404,
    description:
      'No product found with the provided vendorId, userId, and productId',
  })
  async getProductByVendorIdAndUserIdAndProductId(
    @Query('vendorId') vendorId: string,
    @Query('userId') userId: string,
    @Query('productId') productId: string,
  ) {
    if (!vendorId) {
      throw new BadRequestException('vendorId is required');
    }
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    try {
      return await this.ireferProductsService.getProductByVendorIdAndUserIdAndProductIdStrict(
        vendorId,
        userId,
        productId,
      );
    } catch (error) {
      if (error instanceof ProductNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

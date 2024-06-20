import {
  Controller,
  Get,
  Param,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { IreferReferralService } from './irefer-referral.service';
import { Referral } from '../schemas/irefer/referral.schema';
import { Public } from '../auth/guards/public.decorator';
import { IReferReferral } from '../types/irefer-referral';
import { ProductReferral } from '../types/product-referral-type';
import { ReferralNewInput } from '../types/referral–new-input-type';

@Controller('irefer-referral')
export class IreferReferralController {
  constructor(private readonly ireferReferralService: IreferReferralService) {}

  @Public()
  @Get('shop/:shopUrl/product/:productId/user/:userId')
  @ApiOperation({
    summary: 'Retrieve referral by shop URL, product ID, and user ID',
  })
  @ApiParam({
    name: 'shopUrl',
    required: true,
    type: String,
    description: 'The URL of the shop',
  })
  @ApiParam({
    name: 'productId',
    required: true,
    type: String,
    description: 'The ID of the product',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the referral',
    type: Referral,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input provided',
  })
  @ApiResponse({
    status: 404,
    description:
      'No referral found for the provided shop URL, product ID, and user ID',
  })
  async getReferralByProductAndUser(
    @Param('shopUrl') shopUrl: string,
    @Param('productId') productId: string,
    @Param('userId') userId: string,
  ): Promise<Referral> {
    if (!shopUrl || !productId || !userId) {
      throw new BadRequestException(
        'shopUrl, productId, and userId are required',
      );
    }

    if (!/^\d+$/.test(productId)) {
      throw new BadRequestException(
        'productId must be a positive whole number',
      );
    }

    try {
      return await this.ireferReferralService.getByShopAndProductIdAndUserIdStrict(
        shopUrl,
        productId,
        userId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  @Public()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve referrals by user ID' })
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the referrals',
    type: [Referral],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'No referrals found for the provided user ID',
  })
  async getReferralsByUser(
    @Param('userId') userId: string,
  ): Promise<Referral[]> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    try {
      const referrals =
        await this.ireferReferralService.getReferralsByUser(userId);
      if (referrals.length === 0) {
        throw new NotFoundException(
          'No referrals found for the provided user ID',
        );
      }
      return referrals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('shop/:shopUrl/product/:productId')
  @ApiOperation({
    summary: 'Retrieve referrals by shop URL and product ID',
  })
  @ApiParam({
    name: 'shopUrl',
    required: true,
    type: String,
    description: 'The URL of the shop',
  })
  @ApiParam({
    name: 'productId',
    required: true,
    type: String,
    description: 'The ID of the product',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the referrals',
    type: [Referral],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input provided',
  })
  @ApiResponse({
    status: 404,
    description: 'No referrals found for the provided shop URL and product ID',
  })
  async getReferralsByShopAndProduct(
    @Param('shopUrl') shopUrl: string,
    @Param('productId') productId: string,
  ): Promise<Referral[]> {
    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    if (!shopUrl) {
      throw new BadRequestException('shopUrl is required');
    }

    try {
      const referrals =
        await this.ireferReferralService.getReferralsStoreAndByProduct(
          shopUrl,
          productId,
        );
      if (referrals.length === 0) {
        throw new NotFoundException(
          'No referrals found for the provided product ID',
        );
      }
      return referrals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Retrieve referrals by vendor ID' })
  @ApiParam({
    name: 'vendorId',
    required: true,
    type: String,
    description: 'The ID of the vendor',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the referrals',
    type: [Referral],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid vendor ID provided',
  })
  @ApiResponse({
    status: 404,
    description: 'No referrals found for the provided vendor ID',
  })
  async getReferralsByVendor(
    @Param('vendorId') vendorId: string,
  ): Promise<Referral[]> {
    if (!vendorId) {
      throw new BadRequestException('vendorId is required');
    }

    try {
      const referrals =
        await this.ireferReferralService.getReferralsByVendor(vendorId);
      if (referrals.length === 0) {
        throw new NotFoundException(
          'No referrals found for the provided vendor ID',
        );
      }
      return referrals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('store/:storeUrl')
  @ApiOperation({ summary: 'Retrieve referrals by store URL' })
  @ApiParam({
    name: 'storeUrl',
    required: true,
    type: String,
    description: 'The URL of the store',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the referrals',
    type: [Referral],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid store URL provided',
  })
  @ApiResponse({
    status: 404,
    description: 'No referrals found for the provided store URL',
  })
  async getReferralsByStore(
    @Param('storeUrl') storeUrl: string,
  ): Promise<Referral[]> {
    if (!storeUrl) {
      throw new BadRequestException('storeUrl is required');
    }

    try {
      const referrals =
        await this.ireferReferralService.getReferralsByStore(storeUrl);
      if (referrals.length === 0) {
        throw new NotFoundException(
          'No referrals found for the provided store URL',
        );
      }
      return referrals;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Post('add')
  @ApiOperation({ summary: 'Add a new referral' })
  @ApiResponse({
    status: 201,
    description: 'The referral has been successfully created.',
    type: Referral,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid referral data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Example Referral' },
        product_title: { type: 'string', example: 'Example Product' },
        product_id: { type: 'string', example: 'abc123' },
        product_image: {
          type: 'string',
          example: 'https://example.com/image.jpg',
        },
        product_referal_url: {
          type: 'string',
          example: 'https://example.com/product',
        },
        store_url: { type: 'string', example: 'https://example-store.com' },
        ireferal_code: { type: 'string', example: 'REFERRAL10' },
        user_id: { type: 'string', example: 'user123' },
        vendor_id: { type: 'string', example: 'vendor456' },
        custom_description: {
          type: 'string',
          example: 'Custom referral description',
        },
        referral_origin_url: {
          type: 'string',
          example: 'https://example.com/referral-link',
        },
      },
      required: [
        'title',
        'product_title',
        'product_id',
        'product_image',
        'product_referal_url',
        'store_url',
        'ireferal_code',
        'user_id',
        'vendor_id',
        'custom_description',
        'referral_origin_url',
      ],
    },
  })
  async addReferral(@Body() referralData: IReferReferral): Promise<Referral> {
    try {
      return await this.ireferReferralService.addReferral(referralData);
    } catch (error) {
      if (error.message.startsWith('Missing required field')) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('code/:ireferalCode')
  @ApiOperation({ summary: 'Retrieve referral by ireferal code' })
  @ApiParam({
    name: 'ireferalCode',
    required: true,
    type: String,
    description: 'The ireferal code of the referral',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the referral',
    type: Referral,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ireferal code provided',
  })
  @ApiResponse({
    status: 404,
    description: 'No referral found for the provided ireferal code',
  })
  async getReferralByCode(
    @Param('ireferalCode') ireferalCode: string,
  ): Promise<Referral> {
    if (!ireferalCode) {
      throw new BadRequestException('ireferalCode is required');
    }

    try {
      const referral =
        await this.ireferReferralService.getReferralByCodeStrict(ireferalCode);
      return referral;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Post('referral')
  @ApiOperation({ summary: 'Process a new referral' })
  @ApiResponse({
    status: 200,
    description: 'Successfully processed the referral',
    type: ProductReferral,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid referral data provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        product_url: { type: 'string', example: 'https://example.com/product' },
        user_id: { type: 'string', example: 'user123' },
        brand_url: { type: 'string', example: '(optional) https://example.com/brand' },
        RecID: { type: 'string', example: '(optional) rec123' },
        custom_image: { type: 'string', example: '(optional)  https://example.com/image.jpg' },
        custom_video: { type: 'string', example: '(optional)  https://example.com/video.mp4' },
        custom_description: { type: 'string', example: '(optional)  Custom referral description' },
      },
      required: ['product_url', 'user_id'],
    },
  })
  async processReferral(
    @Body() referralNewInput: ReferralNewInput,
  ): Promise<ProductReferral> {

    try {
      return await this.ireferReferralService.processReferral(referralNewInput);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw new BadRequestException(error.message);
      } else {
        console.error(`Error type: ${error.constructor.name}, Error message: ${error.message}`);
        console.error(`Error stack: ${error.stack}`);
        throw new InternalServerErrorException();
      }
    }
  }
}

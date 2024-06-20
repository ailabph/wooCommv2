import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { KeyService } from './key.service';
import {
  InvalidArgumentException,
  InvalidUrl,
} from '../common/errors/custom-errors';
import { Public } from '../auth/guards/public.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { VendorKeyTypeDto } from '../types/vendor-key-type.dto';
import { UtilitiesService } from '../utilities/utilities.service';

@Controller('key')
export class KeyController {
  constructor(
    private readonly keyService: KeyService,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  @Public()
  @Get('/keys')
  @ApiOperation({
    summary: 'Retrieve all vendor keys',
    description: 'Get a list of all vendor keys',
  })
  @ApiQuery({
    name: 'devKey',
    type: String,
    required: true,
    description: 'Developer key',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async getKeys(@Query('devKey') devKey: string) {
    try {
      this.utilitiesService.log(
        'Processing GET endpoint /keys',
        'KeyController:getKeys',
      );

      this.utilitiesService.log(
        `Processing GET endpoint /keys with devKey: ${devKey}`,
        'KeyController:getKeys',
      );

      return await this.keyService.getKeys(devKey);
    } catch (error) {
      this.utilitiesService.log(
        'Error processing GET endpoint /keys ' + error.message,
        'KeyController:getKeys',
        'error',
      );
      if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('/add-key')
  @ApiOperation({
    summary: 'Generates or updates vendor keys',
    description:
      'Add or update keys for vendor or update based on store_url param',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiBody({
    description: 'Payload for creating or updating vendor keys',
    type: VendorKeyTypeDto,
    examples: {
      example1: {
        summary: 'Sample payload',
        value: {
          consumer_key: 'sampleConsumerKey',
          shop: 'sampleShop',
          consumer_secret: 'sampleConsumerSecret',
        },
      },
    },
  })
  async createOrUpdateKeys(@Body() keyData: VendorKeyTypeDto) {
    console.log(`Processing POST endpoint /add-key`);
    try {
      const result = await this.keyService.createOrUpdateKey(keyData);
      return result.message;
    } catch (error) {
      console.log('Key creation or update failed: ', error.message);
      if (error instanceof InvalidArgumentException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof InvalidUrl) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        console.log('unexpected error: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}

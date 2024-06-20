import {
  Controller,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { IreferVendorsService } from './irefer-vendors.service';
import { Vendor } from '../schemas/irefer/vendors.schema';
import { Public } from '../auth/guards/public.decorator';
import { VendorNotFoundException } from '../common/errors/custom-errors';

@Controller('irefer-vendors')
export class IreferVendorsController {
  constructor(private readonly ireferVendorsService: IreferVendorsService) {}

  @Public()
  @Get('domain/:domain')
  @ApiOperation({ summary: 'Retrieve a vendor using their domain' })
  @ApiParam({
    name: 'domain',
    required: true,
    type: String,
    description: 'The domain of the vendor to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the vendor',
    type: Vendor,
  })
  @ApiResponse({ status: 400, description: 'Invalid domain provided' })
  @ApiResponse({
    status: 404,
    description: 'No vendor found with the provided domain',
  })
  async getVendorByDomainStrict(
    @Param('domain') domain: string,
  ): Promise<Vendor> {
    if (!domain) {
      throw new BadRequestException('domain is required');
    }

    try {
      return await this.ireferVendorsService.getVendorByDomainStrict(domain);
    } catch (error) {
      if (error instanceof VendorNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('id/:id')
  @ApiOperation({ summary: 'Retrieve a vendor using their ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'The ID of the vendor to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the vendor',
    type: Vendor,
  })
  @ApiResponse({ status: 400, description: 'Invalid ID provided' })
  @ApiResponse({
    status: 404,
    description: 'No vendor found with the provided ID',
  })
  async getVendorByIdStrict(@Param('id') id: string): Promise<Vendor> {
    if (!id) {
      throw new BadRequestException('id is required');
    }

    try {
      return await this.ireferVendorsService.getVendorByIdStrict(id);
    } catch (error) {
      if (error instanceof VendorNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Public()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Retrieve a vendor using their user ID' })
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
    description: 'The user ID of the vendor to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the vendor',
    type: Vendor,
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID provided' })
  @ApiResponse({
    status: 404,
    description: 'No vendor found with the provided user ID',
  })
  async getVendorByUserIdStrict(@Param('userId') userId: string): Promise<Vendor> {
    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    try {
      return await this.ireferVendorsService.getVendorByUserIdStrict(userId);
    } catch (error) {
      if (error instanceof VendorNotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

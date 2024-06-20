import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('/refer_product')
  async referProduct(
    @Query('storeurl') storeUrl: string,
    @Query('productid') productId: string,
  ) {
    const productData = await this.vendorService.getProductData(
      storeUrl,
      productId,
    );
    return productData;
  }

  @Post('/add_or_update_vendor')
  async addOrUpdateVendor(
    @Body('consumer_key') consumerKey: string,
    @Body('storeurl') storeUrl: string,
    @Body('consumer_secret') consumerSecret: string,
  ): Promise<string> {
    return this.vendorService.addOrUpdateVendor(
      consumerKey,
      storeUrl,
      consumerSecret,
    );
  }


}

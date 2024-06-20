import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('/add')
  async addReferrer(
    @Body('referalid') referalCode: string,
    @Body('storeurl') storeUrl: string,
    @Body('productid') productId: string,
    @Body('recid') recId: string,
    @Body('variant') variant: string,
    @Body('ip') ip: string,
  ) {
    const result = await this.referralsService.addReferrer(referalCode, storeUrl, productId, recId, variant, ip);
    return { message: result };
  }

  // POST /add
  // -- userId, product_url, recId

  // GET /by-store-url
  // GET /by-store-url-and-product-id
  // GET /by-store-url-and-user-id
  // GET /by-user-id
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Referral } from '../schemas/irefer/referral.schema';
import { IReferReferral } from '../types/irefer-referral';
import { ReferralNewInput } from '../types/referral–new-input-type';
import { ProductReferral } from '../types/product-referral-type';
import { UtilitiesService } from '../utilities/utilities.service';
import { IreferUserSubscriptionService } from '../irefer-user-subscription/irefer-user-subscription.service';
import { ProductService } from '../product/product.service';
import { Vendor } from '../schemas/irefer/vendors.schema';
import { IreferVendorsService } from '../irefer-vendors/irefer-vendors.service';
import { ProductInfo } from '../types/product-info';
import { UserSubscription } from '../schemas/irefer/user_subscription.schemas';
import { IreferUsersService } from '../irefer-users/irefer-users.service';
import { User } from '../schemas/irefer/users.schema';
import { Product } from '../schemas/irefer/products.schema';
import { IreferProductsService } from '../irefer-products/irefer-products.service';
import { ProductInfoDto } from '../types/product-info.dto';

@Injectable()
export class IreferReferralService {
  constructor(
    @InjectModel(Referral.name, 'irefer')
    private referralModel: Model<Referral>,
    private utilitiesService: UtilitiesService,
    private ireferUserSubscriptionService: IreferUserSubscriptionService,
    private ireferProductsService: IreferProductsService,
    private productsService: ProductService,
    private ireferVendorsService: IreferVendorsService,
    private ireferUserService: IreferUsersService,
  ) {}

  async getByShopAndProductIdAndUserId(
    shopDomain: string,
    shopProductId: string,
    userId: string,
  ): Promise<Referral | null> {
    console.log(
      `getByShopAndProductIdAndUserId: Received shopDomain: ${shopDomain}, shopProductId: ${shopProductId}, userId: ${userId}`,
    );

    const domain = this.utilitiesService.getDomainFromUrl(shopDomain);
    console.log(`getByShopAndProductIdAndUserId: Extracted domain: ${domain}`);

    const domainVariants = [domain, `http://${domain}`, `https://${domain}`];
    console.log(
      `getByShopAndProductIdAndUserId: domain variants: `,
      domainVariants,
    );

    const referrals = await this.referralModel
      .find({
        product_id: shopProductId,
        store_url: { $in: domainVariants },
        user_id: userId,
      })
      .exec();
    console.log(
      `getByShopAndProductIdAndUserId: Found ${referrals.length} referrals`,
    );

    if (referrals.length === 0) {
      console.log(`getByShopAndProductIdAndUserId: No referrals found`);
      return null;
    }
    console.log(`getByShopAndProductIdAndUserId: Returning first referral`);
    return referrals[0];
  }

  async getByShopAndProductIdAndUserIdStrict(
    shopDomain: string,
    shopProductId: string,
    userId: string,
  ): Promise<Referral> {
    const referral = await this.getByShopAndProductIdAndUserId(
      shopDomain,
      shopProductId,
      userId,
    );

    if (!referral) {
      throw new NotFoundException(
        `Referral not found for shopDomain: ${shopDomain}, shopProductId: ${shopProductId}, userId: ${userId}`,
      );
    }

    return referral;
  }

  async getByProductUrlAndUserId(
    prodUrl: string,
    userId: string,
  ): Promise<Referral | null> {
    console.log(
      `getByProductUrlAndUserId: Received productUrl: ${prodUrl}, userId: ${userId}`,
    );
    prodUrl = this.utilitiesService.assertString(prodUrl, true);
    userId = this.utilitiesService.assertString(userId, true);
    prodUrl = this.utilitiesService.removeHttpProtocol(prodUrl, true);
    prodUrl = this.utilitiesService.removeUrlArguments(prodUrl);
    console.log(
      `getByProductUrlAndUserId: checking if user ${userId} has a similar referral from parameter product_referal_url: ${prodUrl}`,
    );

    const referral = await this.referralModel
      .findOne({
        user_id: userId,
        product_referal_url: { $regex: `^${prodUrl}` },
      })
      .exec();

    if (!referral) {
      console.log(`getByProductUrlAndUserId: No referral found`);
      return null;
    }

    console.log(`getByProductUrlAndUserId: Found referral`);
    return referral;
  }

  async getReferralsByUser(userId: string): Promise<Referral[]> {
    console.log(`Fetching referrals for user ID: ${userId}`);
    const referrals = await this.referralModel
      .find({
        user_id: userId,
      })
      .exec();
    console.log(`Found ${referrals.length} referrals for user ID: ${userId}`);
    return referrals as Referral[];
  }

  async getReferralsStoreAndByProduct(
    shopUrl: string,
    productId: string,
  ): Promise<Referral[]> {
    console.log(
      `getReferralsStoreAndByProduct: Received shopUrl: ${shopUrl}, productId: ${productId}`,
    );

    const domain = this.utilitiesService.getDomainFromUrl(shopUrl);
    console.log(`getReferralsStoreAndByProduct: Extracted domain: ${domain}`);

    const domainVariants = [domain, `http://${domain}`, `https://${domain}`];
    console.log(
      `getReferralsStoreAndByProduct: Domain variants: ${domainVariants}`,
    );

    const referrals = await this.referralModel
      .find({
        product_id: productId,
        store_url: { $in: domainVariants },
      })
      .exec();
    console.log(
      `getReferralsStoreAndByProduct: Found ${referrals.length} referrals`,
    );

    return referrals as Referral[];
  }

  async getReferralsByVendor(vendorId: string): Promise<Referral[]> {
    console.log(`Fetching referrals for vendor ID: ${vendorId}`);
    const referrals = await this.referralModel
      .find({
        vendor_id: vendorId,
      })
      .exec();
    console.log(
      `Found ${referrals.length} referrals for vendor ID: ${vendorId}`,
    );
    return referrals as Referral[];
  }

  async getReferralsByStore(storeUrl: string): Promise<Referral[]> {
    console.log(`Original store URL: ${storeUrl}`);

    // Strip storeUrl of http:// and https://
    storeUrl = storeUrl.replace(/^https?:\/\//, '');
    console.log(`Processed store URL: ${storeUrl}`);

    const referrals = await this.referralModel
      .find({
        store_url: storeUrl,
      })
      .exec();

    console.log(
      `Found ${referrals.length} referrals for store URL: ${storeUrl}`,
    );
    return referrals as Referral[];
  }

  async getReferralByCode(ireferalCode: string): Promise<Referral | null> {
    console.log(
      `getReferralByCode: Fetching referral for ireferal code: ${ireferalCode}`,
    );
    const referral = await this.referralModel
      .findOne({ ireferal_code: ireferalCode })
      .exec();

    if (referral) {
      console.log(
        `getReferralByCode: Found referral for ireferal code: ${ireferalCode}`,
      );
      return referral;
    } else {
      console.log(
        `getReferralByCode: No referral found for ireferal code: ${ireferalCode}`,
      );
      return null;
    }
  }

  async getReferralByCodeStrict(ireferalCode: string): Promise<Referral> {
    const referral = await this.getReferralByCode(ireferalCode);

    if (!referral) {
      throw new NotFoundException(
        `Referral not found for ireferal code: ${ireferalCode}`,
      );
    }

    return referral;
  }

  async createDefaultReferral(
    product: Product,
    product_url: string,
    vendor: Vendor,
    user_id: string,
  ): Promise<Referral> {
    const defaultReferralData: IReferReferral = {
      title: this.utilitiesService.removeHtmlTags(product.title, false),
      product_title: this.utilitiesService.removeHtmlTags(
        product.product_title,
        false,
      ),
      product_id: product.product_id,
      product_image: product.product_image,
      product_referal_url: product_url,
      store_url: this.utilitiesService.addHttpProtocol(vendor.domain),
      ireferal_code: '',
      user_id: user_id,
      vendor_id: vendor.id,
      referral_origin_url: '',
      custom_description: '',
      total_click: 0,
      total_impression_click: 0,
    };

    const newReferral = new this.referralModel(defaultReferralData);
    const savedReferral = await newReferral.save();
    savedReferral.ireferal_code = savedReferral.id;
    savedReferral.product_referal_url =
      this.utilitiesService.addIReferReferralCode(
        product_url,
        savedReferral.id,
      );
    const checkOutPageUrl = this.utilitiesService.envCheckoutPageUrl();
    savedReferral.referral_origin_url = `${checkOutPageUrl}/referral/${savedReferral.id}`;
    savedReferral.referral_shorten_url = null;
    return await savedReferral.save();
  }

  async addReferral(
    referralData: IReferReferral,
    // product: Product,
    // user_id: string,
  ): Promise<Referral> {
    // const shopProduct = await this.productService.getProd
    // const newReferral: Referral = await this.createDefaultReferral()

    console.log('Starting addReferral method');
    const requiredFields = [
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
    ];

    console.log('Required fields:', requiredFields);
    for (const field of requiredFields) {
      console.log(`Checking field: ${field}`);
      if (!referralData[field]) {
        const errorMessage = `Missing required field: ${field}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    }

    console.log(
      `Adding new referral with data: ${JSON.stringify(referralData)}`,
    );
    console.log('All required fields are present');
    const newReferral = new this.referralModel(referralData);
    newReferral.total_click = 0;
    newReferral.total_impression_click = 0;
    newReferral.rec_id = '-';
    console.log('New referral instance created:', newReferral);
    let savedReferral: Referral | PromiseLike<Referral>;
    try {
      savedReferral = await newReferral.save();
      console.log('Referral saved successfully:', savedReferral);
    } catch (error) {
      console.error('Error saving referral:', error);
      throw error;
    }
    console.log(`New referral added with ID: ${savedReferral._id}`);
    console.log('Returning saved referral');
    return savedReferral;
  }

  async processReferral(
    referralNewInput: ReferralNewInput,
  ): Promise<ProductReferral> {
    const requiredFields = ['product_url', 'user_id'];
    for (const field of requiredFields) {
      if (!referralNewInput[field]) {
        throw new BadRequestException(`Missing required field: ${field}`);
      }
    }

    console.log(
      `processReferral: Processing referral for user ID: ${referralNewInput.user_id} and product URL: ${referralNewInput.product_url}`,
    );

    const user: User = await this.ireferUserService.getUserByIdStrict(
      referralNewInput.user_id,
    );

    console.log(
      `processReferral: Checking if existing referral already exists...`,
    );

    const existingReferral = await this.getByProductUrlAndUserId(
      referralNewInput.product_url,
      referralNewInput.user_id,
    );
    if (existingReferral) {
      console.log(
        `processReferral: existing referral found with id: ${existingReferral.id}`,
      );
      const existingProdReferral = this.prepareNewProductReferral(
        existingReferral,
        user,
      );
      return await this.setupProductReferralCustomization(
        existingProdReferral,
        referralNewInput.custom_image,
        referralNewInput.custom_video,
        referralNewInput.custom_description,
      );
    }

    console.log(
      `processReferral: existing referral not found...proceed with creating new one`,
    );

    const productInfo: ProductInfoDto =
      await this.productsService.getProductInfoV3(referralNewInput.product_url);

    console.log(productInfo);

    const vendorUrl: string = this.utilitiesService.getDomainFromUrl(
      productInfo.product_permalink,
    );
    console.log(`processReferral: vendorUrl: ${vendorUrl}`);

    const vendor: Vendor =
      await this.ireferVendorsService.getVendorByDomainStrict(vendorUrl);

    let userPersonalizedProduct: Product | null =
      await this.ireferProductsService.getProductByVendorIdAndUserIdAndProductId(
        vendor.id,
        user.id,
        productInfo.id + '',
      );

    if (!userPersonalizedProduct) {
      console.log(
        `processReferral: personalized product not found, creating a new one...`,
      );
      const referral_url = this.utilitiesService.addIReferReferralCode(
        productInfo.product_permalink,
      );
      userPersonalizedProduct = await this.ireferProductsService.addProduct(
        productInfo,
        vendor,
        user.id,
        referralNewInput.RecID ?? '',
        referral_url,
        referralNewInput.custom_image ?? '',
        referralNewInput.custom_video ?? '',
        referralNewInput.custom_description ?? '',
      );
      console.log(
        `processReferral: personalized product created with id `,
        userPersonalizedProduct.id,
      );
    }

    const checkOutPageUrl = this.utilitiesService.envCheckoutPageUrl();

    const newReferral = await this.addReferral({
      ireferal_code: '-',
      product_id: productInfo.id,
      product_image: productInfo.product_image,
      product_referal_url: userPersonalizedProduct.product_referal_url,
      product_title: productInfo.name,
      referral_origin_url: `${checkOutPageUrl}/referral/`,
      store_url: this.utilitiesService.addHttpProtocol(vendor.domain),
      title: productInfo.name,
      user_id: user.id,
      vendor_id: vendor.id,
      custom_description: productInfo.description,
    });
    newReferral.ireferal_code = newReferral.id;
    newReferral.product_referal_url =
      this.utilitiesService.addIReferReferralCode(
        productInfo.product_permalink,
        newReferral.id,
      );
    newReferral.referral_origin_url = `${checkOutPageUrl}/referral/${newReferral.id}`;

    await newReferral.save();

    const newProdReferral = this.prepareNewProductReferral(newReferral, user);
    return await this.setupProductReferralCustomization(
      newProdReferral,
      referralNewInput.custom_image,
      referralNewInput.custom_video,
      referralNewInput.custom_description,
    );
  }

  prepareNewProductReferral(referral: Referral, user: User): ProductReferral {
    return {
      _id: referral.id ?? '',
      vendor_id: referral.vendor_id ?? '',
      rec_id: referral.rec_id ?? '',
      store_url: referral.store_url ?? '',
      product_id: referral.product_id ?? '',
      title: referral.title ?? '',
      product_title: referral.product_title ?? '',
      product_description: referral.product_description ?? '',
      product_image: referral.product_image ?? '',
      user_id: user.id ?? '',
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      referral_shorten_url: referral.referral_shorten_url ?? '',
      product_referal_url: referral.product_referal_url ?? '',
      custom_image: referral.custom_image ?? '',
      custom_image_medium: '',
      custom_image_small: '',
      custom_video: referral.custom_video ?? '',
      custom_description: referral.custom_description ?? '',
    };
  }

  async setupProductReferralCustomization(
    prodReferral: ProductReferral,
    custom_image: string = '',
    custom_video: string = '',
    custom_description: string = '',
  ): Promise<ProductReferral> {
    const userSub: UserSubscription =
      await this.ireferUserSubscriptionService.getByUserIdStrict(
        prodReferral.user_id,
      );

    if (userSub.type === 'premium' && userSub.status === 'activated') {
      prodReferral.custom_image = custom_image;
      prodReferral.custom_image_medium = prodReferral.custom_image.replace(
        '/public/',
        '/public/medium/',
      );
      prodReferral.custom_image_small = prodReferral.custom_image.replace(
        '/public/',
        '/public/small/',
      );
      prodReferral.custom_video = custom_video;
      prodReferral.custom_description = custom_description ?? '';
    }

    return prodReferral;
  }

  // generateReferralUrl(product: Product, user: User) {}
}

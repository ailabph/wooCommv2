import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseDynamicLinks } from 'firebase-dynamic-links';
import { FirebaseShortenLink } from '../types/firebase-shorten-link';
import {
  InvalidApiResponseType,
  InvalidReferralCode,
  InvalidUrl,
  MissingEnvironmentVariableException,
  InvalidArgumentException,
  ProductSlugNotFound,
} from '../common/errors/custom-errors';
import * as d from 'fp-ts/Either';
import {
  WooProductCodec,
  WooProductType,
  WooProductsType,
  WooProductTypesCodec,
} from '../types/woo-prod-type';
import { AxiosReturn, AxiosReturnCodec } from '../types/axios-return-type';
import * as t from 'io-ts';
import { isRight, fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { PathReporter } from 'io-ts/PathReporter';
import {
  WooPrivateProductV3Codec,
  WooPrivateProductV3Type,
} from '../types/woo-private-prod-v3-type';
import { WooProductV3Codec, WooProductV3Type } from '../types/woo-prod-v3-type';
import {
  MagentoProductCodec,
  MagentoProductType,
} from '../types/magento-prod-type';
import { VendorKeyCodec, VendorKeyType } from '../types/vendor-key-type';

@Injectable()
export class UtilitiesService {
  // region CHECKER

  // endregion CHECKER

  async getFirebaseShortLink(
    url: string,
    title: string,
    description: string,
    image: string,
  ): Promise<FirebaseShortenLink | null> {
    console.log(
      `getFirebaseShortLink: Creating Firebase shorten link for URL: ${url}`,
    );
    console.log(`getFirebaseShortLink: Title: ${title}`);
    console.log(`getFirebaseShortLink: Description: ${description}`);
    console.log(`getFirebaseShortLink: Image: ${image}`);

    const firebaseApiKey = this.envFirebaseApiKey();
    const firebaseDynamicLinks = new FirebaseDynamicLinks(firebaseApiKey);
    const longUrl = url;
    const domainUriPrefix = this.envDomainUriPrefix();
    const apiKeyLast6 = firebaseApiKey.slice(-6);
    console.log(`getFirebaseShortLink: Firebase API key: ...${apiKeyLast6}`);
    console.log(`getFirebaseShortLink: Domain URI prefix: ${domainUriPrefix}`);

    try {
      const { shortLink, previewLink } = await firebaseDynamicLinks.createLink({
        dynamicLinkInfo: {
          domainUriPrefix,
          link: longUrl,
          socialMetaTagInfo: {
            socialTitle: title,
            socialDescription: description,
            socialImageLink: image,
          },
        },
      });
      console.log(`getFirebaseShortLink: Generated short link: ${shortLink}`);
      console.log(
        `getFirebaseShortLink: Generated preview link: ${previewLink}`,
      );
      return { shortLink, previewLink };
    } catch (error) {
      console.error(
        `getFirebaseShortLink: Error creating Firebase shorten link: ${error.message}`,
      );
      return null;
    }
  }

  getProductSlug(_url: string): string {
    try {
      console.log(`getProductSlug: Extracting product slug from URL: ${_url}`);

      // If `_url` does not contain http:// or https://, prepend it
      if (!_url.startsWith('http://') && !_url.startsWith('https://')) {
        _url = 'https://' + _url;
      }
      const url = new URL(_url);
      console.log(`getProductSlug: Parsed URL: ${url}`);

      // Split the pathname by '/'
      const pathSegments = url.pathname.split('/');
      console.log(
        `getProductSlug: Path segments: ${JSON.stringify(pathSegments)}`,
      );

      // Check if the last character is a '/'
      const lastIndex = pathSegments[pathSegments.length - 1] === '' ? -2 : -1;
      console.log(`getProductSlug: Last index: ${lastIndex}`);

      // Get the last part of the pathname
      const productSlug = pathSegments[pathSegments.length + lastIndex];
      console.log(`getProductSlug: Extracted product slug: ${productSlug}`);

      if (!productSlug) {
        throw new ProductSlugNotFound(
          'Product slug not found from url: ' + _url,
        );
      }

      // Remove `.html` if it exists at the end of the productSlug
      const cleanedProductSlug = productSlug.endsWith('.html')
        ? productSlug.slice(0, -5)
        : productSlug;

      console.log(
        `getProductSlug: Cleaned product slug: ${cleanedProductSlug}`,
      );

      return cleanedProductSlug;
    } catch (error) {
      console.error(
        `getProductSlug: Error extracting product slug from URL: ${_url}`,
        error,
      );
      throw new ProductSlugNotFound('Product slug not found from url: ' + _url);
    }
  }

  getDomainFromUrl(_url: string): string {
    console.log(`getDomainFromUrl: Extracting store URL from URL: ${_url}`);

    const dotCount = (_url.match(/\./g) || []).length;
    if (dotCount === 0) {
      throw new InvalidUrl(`Invalid URL: ${_url}`);
    }

    if (!_url.startsWith('http://') && !_url.startsWith('https://')) {
      _url = 'https://' + _url;
    }

    try {
      const url = new URL(_url);
      console.log(`Parsed URL: ${url}`);

      const storeUrl = url.hostname;
      console.log(`getDomainFromUrl: Extracted store URL: ${storeUrl}`);

      return storeUrl;
    } catch (error) {
      console.error(
        `getDomainFromUrl: Error extracting store URL from URL: ${_url}`,
        error,
      );
      throw new InvalidUrl(`Invalid URL: ${_url}`);
    }
  }

  cleanJsonString(jsonString: string): string | false {
    console.log('cleanJsonString: Received JSON string:', jsonString);

    const firstCurlyIndex = jsonString.indexOf('{');
    if (firstCurlyIndex === -1) {
      console.log('cleanJsonString: No opening curly brace found.');
      return false;
    }
    console.log(
      'cleanJsonString: First opening curly brace index:',
      firstCurlyIndex,
    );

    const lastCurlyIndex = jsonString.lastIndexOf('}');
    if (lastCurlyIndex === -1) {
      console.log('cleanJsonString: No closing curly brace found.');
      return false;
    }
    console.log(
      'cleanJsonString: Last closing curly brace index:',
      lastCurlyIndex,
    );

    const jsonSubstring = jsonString.substring(
      firstCurlyIndex,
      lastCurlyIndex + 1,
    );
    console.log('cleanJsonString: Extracted JSON substring:', jsonSubstring);

    try {
      JSON.parse(jsonSubstring);
      console.log('cleanJsonString: JSON substring is valid.');
      return jsonSubstring;
    } catch (error) {
      console.log('cleanJsonString: JSON substring is invalid.');
      return false;
    }
  }

  getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new MissingEnvironmentVariableException(key);
    }
    return value;
  }

  getNumber(
    value: string | number,
    forceInt: boolean = false,
    forcePositive: boolean = false,
  ): number {
    console.log(`getNumber: Received value: ${value}`);
    console.log(`getNumber: forceInt: ${forceInt}`);
    console.log(`getNumber: forcePositive: ${forcePositive}`);

    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new BadRequestException(
        'Invalid argument type: value' + value + ' is not a number',
      );
    }

    const toReturn = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(toReturn)) {
      throw new BadRequestException(
        'Invalid argument type: value' + value + ' is not a number',
      );
    }

    console.log(`getNumber: Parsed value: ${toReturn}`);
    if (forceInt && !Number.isInteger(toReturn)) {
      throw new BadRequestException(
        `Value must be an integer, current value is: ${toReturn}`,
      );
    }
    if (forcePositive && toReturn < 0) {
      throw new BadRequestException(
        'Value must be positive, current value is: ' + toReturn,
      );
    }
    return toReturn;
  }
  addHttpProtocol(url: string, secure: boolean = true): string {
    console.log(`addHttpProtocol: Received URL: ${url}`);
    if (!url || url === '' || !url.includes('.')) {
      console.log(`addHttpProtocol: Invalid URL: ${url}`);
      throw new InvalidUrl(`Invalid URL: ${url}`);
    }

    const protocol = secure ? 'https://' : 'http://';
    console.log(`addHttpProtocol: Using protocol: ${protocol}`);
    const processedUrl =
      url.startsWith('http://') || url.startsWith('https://')
        ? url
        : protocol + url;
    console.log(`addHttpProtocol: Processed URL: ${processedUrl}`);

    try {
      new URL(processedUrl);
      console.log(`addHttpProtocol: Valid URL: ${processedUrl}`);
      return processedUrl;
    } catch (e) {
      console.log(
        `addHttpProtocol: Invalid URL after processing: ${processedUrl}`,
      );
      throw new InvalidUrl(`Invalid URL: ${url}`);
    }
  }

  removeHttpProtocol(url: string, removeWww: boolean = false): string {
    console.log(`removeHttpProtocol: Received URL: ${url}`);
    if (!url) {
      console.log(`removeHttpProtocol: Invalid URL: ${url}`);
      throw new InvalidUrl(`Invalid URL: ${url}`);
    }

    if (!url.includes('.')) {
      console.log(`removeHttpProtocol: URL does not contain a dot: ${url}`);
      throw new InvalidUrl(`Invalid URL: ${url}`);
    }

    url = this.addHttpProtocol(url, false);
    console.log(`removeHttpProtocol: URL after adding protocol: ${url}`);

    try {
      const parsedUrl: URL = new URL(url);
      console.log(`removeHttpProtocol: Parsed URL: ${parsedUrl}`);
      const host: string = parsedUrl.host.endsWith('/')
        ? parsedUrl.host.slice(0, -1)
        : parsedUrl.host;
      const pathname: string = parsedUrl.pathname.endsWith('/')
        ? parsedUrl.pathname.slice(0, -1)
        : parsedUrl.pathname;
      let toReturn: string = host + pathname + parsedUrl.search;
      if (toReturn.endsWith('/')) {
        toReturn = toReturn.slice(0, -1);
      }
      if (removeWww) {
        toReturn = toReturn.replace(/^www\./, '');
      }
      toReturn = toReturn.replace('http://', '');
      toReturn = toReturn.replace('https://', '');
      console.log(`removeHttpProtocol: Final URL: ${toReturn}`);
      return toReturn;
    } catch (e) {
      console.log(`removeHttpProtocol: Error parsing URL: ${url}`);
      throw new InvalidUrl(`Invalid URL: ${url}`);
    }
  }

  removeHtmlTags(text: string, convertBrToNewLine: boolean = true): string {
    console.log(`removeHtmlTags: Received text: ${text}`);
    if (convertBrToNewLine) {
      console.log(`removeHtmlTags: Converting <br> tags to newline`);
      text = text.replace(/<br\s*\/?>/gi, '\n');
    } else {
      console.log(`removeHtmlTags: Converting <br> tags to space`);
      text = text.replace(/<br\s*\/?>/gi, ' ');
    }
    const cleanedText = text.replace(/<\/?[^>]+(>|$)/g, '');
    console.log(`removeHtmlTags: Cleaned text: ${cleanedText}`);
    return cleanedText;
  }

  //region IREFER UTILITIES

  addIReferReferralCode(url: string, referralCode: string = ''): string {
    console.log(`addIReferReferralCode: Received URL: ${url}`);
    console.log(
      `addIReferReferralCode: Received referral code: ${referralCode}`,
    );

    // if (!referralCode) {
    //   console.log(`addIReferReferralCode: Referral code is empty`);
    //   throw new InvalidReferralCode('Referral code cannot be empty');
    // }

    console.log(`addIReferReferralCode: Removing HTTP protocol from URL`);
    url = this.removeHttpProtocol(url, true);
    console.log(`addIReferReferralCode: URL after removing protocol: ${url}`);

    let toReturn: string = '';
    const separator = url.includes('?') ? '&' : '?';
    console.log(`addIReferReferralCode: Using separator: ${separator}`);
    toReturn = `${url}${separator}ireferal_code=${referralCode}`;
    console.log(
      `addIReferReferralCode: Final URL with referral code: ${toReturn}`,
    );

    return toReturn;
  }

  removeIReferReferralCode(url: string): string {
    console.log(`removeIReferReferralCode: Received URL: ${url}`);

    let toReturn = url.replace('?ireferal_code=', '');
    toReturn = toReturn.replace('&ireferal_code=', '');
    console.log(`removeIReferReferralCode: Final URL: ${toReturn}`);

    return toReturn;
  }

  removeUrlArguments(url: string): string {
    console.log(`removeUrlArguments: Received URL: ${url}`);
    this.assertString(url, true);
    const newurl = this.addHttpProtocol(url);
    const urlObject = new URL(newurl);
    const toReturn = this.removeHttpProtocol(
      urlObject.origin + urlObject.pathname,
    );
    console.log(`removeUrlArguments: Final URL: ${toReturn}`);
    return toReturn;
  }

  //endregion IREFER UTILITIES

  // region TYPE VALIDATORS

  assertString(
    value: unknown,
    assertNotEmpty: boolean = false,
    propertyName: string = '',
  ): string {
    if (typeof value !== 'string') {
      throw new BadRequestException(`Value:${value} is not a string`);
    }
    if (assertNotEmpty && value.trim() === '') {
      throw new BadRequestException(
        `Value:${value} ${propertyName} is an empty string`,
      );
    }
    return value;
  }

  extractMissingProperties(errors: t.Errors): string[] {
    const missingProperties: string[] = [];

    errors.forEach((error) => {
      error.context.forEach((context) => {
        if (context.type.name === 'undefined' && context.actual === undefined) {
          missingProperties.push(context.key);
        }
      });
    });

    return missingProperties;
  }

  // endregion TYPE VALIDATORS

  private getMissingProperties<T>(data: T, codec: t.Type<T>): string[] {
    if (!('props' in codec)) {
      throw new Error('Codec does not have props');
    }

    const expectedKeys = Object.keys((codec as any).props).filter(
      (key) =>
        (codec as any).props[key]._tag !== 'UnionType' ||
        !(codec as any).props[key].types.some(
          (type: any) => type._tag === 'UndefinedType',
        ),
    );
    const actualKeys = Object.keys(data);
    return expectedKeys.filter((key) => !actualKeys.includes(key));
  }

  // region EXTERNAL DATA TO TYPE

  getAxiosReturn(data: unknown): AxiosReturn {
    const result = AxiosReturnCodec.decode(data);
    if (isRight(result)) {
      return result.right;
    } else {
      const errors = PathReporter.report(result);
      throw new InvalidApiResponseType(
        `Invalid Axios response, error data: ${errors.join(', ')}`,
      );
    }
  }

  getWooProductFromArray(data: unknown): WooProductsType {
    const response = this.getAxiosReturn(data);
    console.log(
      `getWooProduct: valid Axios response, with status:${response.status}`,
    );

    if (!Array.isArray(response.data)) {
      console.error(
        'getWooProduct: Data property is not an array:',
        response.data,
      );
      throw new InvalidApiResponseType(
        `Invalid WooCommerce public product V2 response, data property is expected to be an array`,
      );
    }

    const result = WooProductTypesCodec.decode(response.data);
    if (d.isRight(result)) {
      console.log('getWooProduct: Decoded data successfully:', result.right);
      return result.right;
    } else {
      // Identify missing properties
      const missingProperties = this.getMissingProperties(
        response.data[0],
        WooProductCodec,
      );
      console.log('Missing properties:', missingProperties);

      throw new InvalidApiResponseType(
        `Invalid woocommerce product structure. Expected properties: ` +
          missingProperties.join(', ') +
          ` are missing`,
      );
    }
  }

  getWooProductSingle(data: unknown): WooProductV3Type {
    const response = this.getAxiosReturn(data);
    console.log(
      `getWooProduct: valid Axios response, with status:${response.status}`,
    );

    const result = WooProductV3Codec.decode(response.data);
    if (d.isRight(result)) {
      console.log(
        `getWooProduct: valid woo product data, decoded successfully`,
      );
      return result.right;
    } else {
      const missingProperties = this.getMissingProperties(
        response.data,
        WooProductCodec,
      );
      console.log('getWooProduct: Missing properties,', missingProperties);

      throw new InvalidApiResponseType(
        `Invalid woocommerce product structure. Expected properties: ` +
          missingProperties.join(', ') +
          ` are missing`,
      );
    }
  }

  getWooPrivateProductV3(data: unknown): WooPrivateProductV3Type {
    console.log('getWooPrivateProductV3: Received data:', data);
    const response = this.getAxiosReturn(data);
    console.log('getWooPrivateProductV3: Axios response:', response);

    const result = WooPrivateProductV3Codec.decode(response.data);
    if (d.isRight(result)) {
      console.log(
        'getWooPrivateProductV3: Decoded data successfully:',
        result.right,
      );
      return result.right;
    } else {
      const errors = PathReporter.report(result);
      console.error('getWooPrivateProductV3: Error decoding data:', errors);
      throw new InvalidApiResponseType(
        `Invalid WooCommerce private product V3 response, error data: ${errors.join(
          ', ',
        )}`,
      );
    }
  }

  getMagentoProduct(data: unknown): MagentoProductType {
    const response = this.getAxiosReturn(data);
    console.log(
      `getMagentoProduct: valid Axios response, with status:${response.status}`,
    );
    const result = MagentoProductCodec.decode(response.data);
    if (d.isRight(result)) {
      console.log('getMagentoProduct: Decoded data successfully');
      return result.right;
    }
  }

  // endregion EXTERNAL DATA TO TYPE

  // region DECODER

  decodeVendorKeyData(data: unknown): VendorKeyType {
    const result = VendorKeyCodec.decode(data);
    if (d.isRight(result)) {
      return result.right as VendorKeyType;
    } else {
      const missingProperties = this.getMissingProperties(data, VendorKeyCodec);
      if (missingProperties.length > 0) {
        console.log('Missing properties:', missingProperties);
        throw new InvalidArgumentException(
          'Missing properties: ' + missingProperties.join(', '),
        );
      } else {
        const invalidTypes = this.pathReporterCleaner(
          PathReporter.report(result),
        );
        console.log(`Invalid types: ${invalidTypes}`);
        throw new InvalidArgumentException(
          'Invalid types: ' + invalidTypes.join(', '),
        );
      }
    }
  }

  pathReporterCleaner(errors: string[]): string[] {
    return errors.map((error) => {
      return error.replace(/: {[^}]+}\//g, '');
    });
  }

  // endregion

  // region ENVIRONMENT VARIABLES

  envCheckoutPageUrl(): string {
    return this.getEnv('CHECK_OUT_PAGE_URL');
  }

  envFirebaseApiKey(): string {
    return this.getEnv('firebaseApiKey');
  }

  envDomainUriPrefix(): string {
    return this.getEnv('domainUriPrefix');
  }

  envDeveloperKey(): string {
    return this.getEnv('DEVELOPER_KEY');
  }

  // endregion ENVIRONMENT VARIABLES

  // region LOGGER

  log(message: string, context: string = '', type: string = 'info'): void {
    context = context === '' ? '' : `[${context}]`;
    const currentDateTime = new Date().toISOString();
    if (type === 'info') {
      console.log(`[APP] [${currentDateTime}] [DEBUG] ${context} ${message}`);
    } else if (type === 'error') {
      console.error(`[APP] [${currentDateTime}] [ERROR] ${context} ${message}`);
    }
  }

  // endregion LOGGER
}

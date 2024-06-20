import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesService } from './utilities.service';
import {
  InvalidReferralCode,
  InvalidUrl,
  MissingEnvironmentVariableException,
  ProductSlugNotFound,
} from '../common/errors/custom-errors';
import { BadRequestException } from '@nestjs/common';

describe('UtilitiesService', () => {
  let service: UtilitiesService;
  const originalEnv = process.env;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilitiesService],
    }).compile();

    service = module.get<UtilitiesService>(UtilitiesService);
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('cleanJsonString', () => {
    it('should clean invalid JSON with script tags at the beginning', () => {
      const invalidJson =
        '<script>whatever message</scritpt>{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}';
      const expectedJson =
        '{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}';
      const result = service.cleanJsonString(invalidJson);
      expect(result).toEqual(expectedJson);
    });

    it('should clean invalid JSON with script tags at the end', () => {
      const invalidJson =
        '{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}<script>yow</script>';
      const expectedJson =
        '{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}';
      const result = service.cleanJsonString(invalidJson);
      expect(result).toEqual(expectedJson);
    });

    it('should clean invalid JSON with PHP warnings', () => {
      const invalidJson =
        'PHP Warning: Some warnings{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}';
      const expectedJson =
        '{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}';
      const result = service.cleanJsonString(invalidJson);
      expect(result).toEqual(expectedJson);
    });

    it('should clean invalid JSON with other text after the JSON', () => {
      const invalidJson =
        '{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}Sample other text';
      const expectedJson =
        '{"description": "<div><h1>Hello</h1></div>", "img": "https://google.com/image.jpg", "title": "Title"}';
      const result = service.cleanJsonString(invalidJson);
      expect(result).toEqual(expectedJson);
    });

    it('should return false for invalid JSON that cannot be cleaned', () => {
      const invalidJson = 'This is not a valid JSON string';
      const result = service.cleanJsonString(invalidJson);
      expect(result).toBe(false);
    });
  });

  describe('getProductSlug', () => {
    test('should return "shoes" for URL "https://www.google.com/products/shoes"', () => {
      const result = service.getProductSlug(
        'https://www.google.com/products/shoes',
      );
      expect(result).toBe('shoes');
    });

    test('should return "vase" for URL "www.website.com/category/products/vase?tracker=123abc"', () => {
      const result = service.getProductSlug(
        'http://www.website.com/category/products/vase?tracker=123abc',
      );
      expect(result).toBe('vase');
    });

    test('should return "black-shoe-rack" for URL "shop.somesite.xyz/bread-1/bread-2/bread-3/black-shoe-rack?x=abc&y=123"', () => {
      const result = service.getProductSlug(
        'shop.somesite.xyz/bread-1/bread-2/bread-3/black-shoe-rack?x=abc&y=123',
      );
      expect(result).toBe('black-shoe-rack');
    });

    test('should throw ProductSlugNotFound for invalid URL "abc123"', () => {
      expect(() => service.getProductSlug('abc123')).toThrow(
        ProductSlugNotFound,
      );
    });

    test('should throw ProductSlugNotFound for URL "http://website.com"', () => {
      expect(() => service.getProductSlug('http://website.com')).toThrow(
        ProductSlugNotFound,
      );
    });

    test('should return slug without .html', () => {
      const result = service.getProductSlug(
        'http://website.com/russell-athletic-short-sleeve.html?tacker=123',
      );
      expect(result).toBe('russell-athletic-short-sleeve');
    });
  });

  describe('getDomainFromUrl', () => {
    it('should return the store URL for a given URL with https protocol', () => {
      const url = 'https://example.com';
      const expectedStoreUrl = 'example.com';
      const result = service.getDomainFromUrl(url);
      expect(result).toEqual(expectedStoreUrl);
    });

    it('should return the store URL for a given URL with https and www', () => {
      const url = 'https://www.example.com';
      const expectedStoreUrl = 'www.example.com';
      const result = service.getDomainFromUrl(url);
      expect(result).toEqual(expectedStoreUrl);
    });

    it('should return the store URL for a given URL with only www', () => {
      const url = 'www.example.com';
      const expectedStoreUrl = 'www.example.com';
      const result = service.getDomainFromUrl(url);
      expect(result).toEqual(expectedStoreUrl);
    });

    it('should return the store URL for a given URL with http protocol and path', () => {
      const url = 'http://example.com/abc/123';
      const expectedStoreUrl = 'example.com';
      const result = service.getDomainFromUrl(url);
      expect(result).toEqual(expectedStoreUrl);
    });

    it('should return the store URL for a given URL without protocol', () => {
      const url = 'example.com';
      const expectedStoreUrl = 'example.com';
      const result = service.getDomainFromUrl(url);
      expect(result).toEqual(expectedStoreUrl);
    });

    it('should return the store URL for a given URL with subdomain and query parameters', () => {
      const url = 'web3.example.com/abc?name=123';
      const expectedStoreUrl = 'web3.example.com';
      const result = service.getDomainFromUrl(url);
      expect(result).toEqual(expectedStoreUrl);
    });

    it('should throw an error for an invalid URL', () => {
      expect(() => service.getDomainFromUrl('abc123')).toThrowError(
        new InvalidUrl('Invalid URL: abc123'),
      );
    });
  });

  describe('UtilitiesService', () => {
    let service: UtilitiesService;
    const originalEnv = process.env;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [UtilitiesService],
      }).compile();

      service = module.get<UtilitiesService>(UtilitiesService);
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return the environment variable value if it exists', () => {
      process.env.TEST_KEY = 'test_value';
      expect(service.getEnv('TEST_KEY')).toBe('test_value');
    });

    it('should throw MissingEnvironmentVariableException if the environment variable does not exist', () => {
      delete process.env.TEST_KEY;
      expect(() => service.getEnv('TEST_KEY')).toThrow(
        MissingEnvironmentVariableException,
      );
    });
  });

  describe('addHttpProtocol', () => {
    it('should add https protocol to a URL without protocol', () => {
      const url = 'example.com';
      const expectedUrl = 'https://example.com';
      const result = service.addHttpProtocol(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should add http protocol to a URL without protocol when secure is false', () => {
      const url = 'example.com';
      const expectedUrl = 'http://example.com';
      const result = service.addHttpProtocol(url, false);
      expect(result).toEqual(expectedUrl);
    });

    it('should not modify a URL that already has http protocol', () => {
      const url = 'http://example.com';
      const expectedUrl = 'http://example.com';
      const result = service.addHttpProtocol(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should not modify a URL that already has https protocol', () => {
      const url = 'https://example.com';
      const expectedUrl = 'https://example.com';
      const result = service.addHttpProtocol(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should throw InvalidUrl for an empty URL', () => {
      const url = '';
      expect(() => service.addHttpProtocol(url)).toThrow(InvalidUrl);
    });

    it('should throw InvalidUrl for a URL without a dot', () => {
      const url = 'invalidurl';
      expect(() => service.addHttpProtocol(url)).toThrow(InvalidUrl);
    });

    it('should throw InvalidUrl for a malformed URL', () => {
      const url = 'http://invalid-url';
      expect(() => service.addHttpProtocol(url)).toThrow(InvalidUrl);
    });
  });

  describe('removeHtmlTags', () => {
    it('should remove all HTML tags and replace <br> with newline by default', () => {
      const input = '<div>Hello<br>World</div>';
      const expectedOutput = 'Hello\nWorld';
      const result = service.removeHtmlTags(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and replace <br> with space when convertBrToNewLine is false', () => {
      const input = '<div>Hello<br>World</div>';
      const expectedOutput = 'Hello World';
      const result = service.removeHtmlTags(input, false);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and handle self-closing <br/> tags', () => {
      const input = '<div>Hello<br/>World</div>';
      const expectedOutput = 'Hello\nWorld';
      const result = service.removeHtmlTags(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and handle self-closing <br/> tags with space when convertBrToNewLine is false', () => {
      const input = '<div>Hello<br/>World</div>';
      const expectedOutput = 'Hello World';
      const result = service.removeHtmlTags(input, false);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and handle multiple <br> tags', () => {
      const input = '<div>Hello<br><br>World</div>';
      const expectedOutput = 'Hello\n\nWorld';
      const result = service.removeHtmlTags(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and handle multiple <br> tags with space when convertBrToNewLine is false', () => {
      const input = '<div>Hello<br><br>World</div>';
      const expectedOutput = 'Hello  World';
      const result = service.removeHtmlTags(input, false);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and handle nested tags', () => {
      const input = '<div><p>Hello<br>World</p></div>';
      const expectedOutput = 'Hello\nWorld';
      const result = service.removeHtmlTags(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should remove all HTML tags and handle nested tags with space when convertBrToNewLine is false', () => {
      const input = '<div><p>Hello<br>World</p></div>';
      const expectedOutput = 'Hello World';
      const result = service.removeHtmlTags(input, false);
      expect(result).toEqual(expectedOutput);
    });

    it('should return an empty string when input is an empty string', () => {
      const input = '';
      const expectedOutput = '';
      const result = service.removeHtmlTags(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should return the same string when there are no HTML tags', () => {
      const input = 'Hello World';
      const expectedOutput = 'Hello World';
      const result = service.removeHtmlTags(input);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('removeHttpProtocol', () => {
    it('should remove https protocol from URL', () => {
      const url = 'https://www.google.com';
      const expected = 'www.google.com';
      const result = service.removeHttpProtocol(url);
      expect(result).toEqual(expected);
    });

    it('should remove http protocol from URL with path and query', () => {
      const url = 'http://apple.com/store/iphone/iphone-13?color=blue';
      const expected = 'apple.com/store/iphone/iphone-13?color=blue';
      const result = service.removeHttpProtocol(url);
      expect(result).toEqual(expected);
    });

    it('should return the same URL if no protocol is present', () => {
      const url = 'amazon.com';
      const expected = 'amazon.com';
      const result = service.removeHttpProtocol(url);
      expect(result).toEqual(expected);
    });

    it('should throw InvalidUrl for URL without a dot', () => {
      const url = 'http://amazon';
      expect(() => service.removeHttpProtocol(url)).toThrow(InvalidUrl);
    });

    it('should throw InvalidUrl for an empty URL', () => {
      const url = '';
      expect(() => service.removeHttpProtocol(url)).toThrow(InvalidUrl);
    });
  });

  describe('addIReferReferralCode', () => {
    it('should add referral code to URL without query parameters', () => {
      const url = 'https://example.com';
      const referralCode = '123abc';
      const expectedUrl = 'example.com?ireferal_code=123abc';
      const result = service.addIReferReferralCode(url, referralCode);
      expect(result).toEqual(expectedUrl);
    });

    it('should add referral code to URL with query parameters', () => {
      const url = 'http://amazon.com/store/iphone';
      const referralCode = 'abc123';
      const expectedUrl = 'amazon.com/store/iphone?ireferal_code=abc123';
      const result = service.addIReferReferralCode(url, referralCode);
      expect(result).toEqual(expectedUrl);
    });

    it('should add referral code to URL with existing query parameters', () => {
      const url = 'www.google.com?track=zxc';
      const referralCode = '123abc';
      const expectedUrl = 'google.com?track=zxc&ireferal_code=123abc';
      const result = service.addIReferReferralCode(url, referralCode);
      expect(result).toEqual(expectedUrl);
    });

    it('should throw InvalidUrl for invalid URL', () => {
      const url = 'foobar';
      const referralCode = '123abc';
      expect(() => service.addIReferReferralCode(url, referralCode)).toThrow(
        InvalidUrl,
      );
    });

  });

  describe('getNumber', () => {
    it('should return the number when given a number', () => {
      expect(service.getNumber(42)).toBe(42);
      expect(service.getNumber(-3.14)).toBe(-3.14);
    });

    it('should parse the number when given a numeric string', () => {
      expect(service.getNumber('42')).toBe(42);
      expect(service.getNumber('-3.14')).toBe(-3.14);
    });

    it('should throw BadRequestException for invalid argument type', () => {
      expect(() => service.getNumber(true as any)).toThrowError(
        BadRequestException,
      );
      expect(() => service.getNumber(null as any)).toThrowError(
        BadRequestException,
      );
      expect(() => service.getNumber(undefined as any)).toThrowError(
        BadRequestException,
      );
      expect(() => service.getNumber({} as any)).toThrowError(
        BadRequestException,
      );
      expect(() => service.getNumber([] as any)).toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when forceInt is true and value is not an integer', () => {
      expect(() => service.getNumber(3.14, true)).toThrowError(
        BadRequestException,
      );
      expect(() => service.getNumber('3.14', true)).toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when forcePositive is true and value is negative', () => {
      expect(() => service.getNumber(-42, false, true)).toThrowError(
        BadRequestException,
      );
      expect(() => service.getNumber('-42', false, true)).toThrowError(
        BadRequestException,
      );
    });
  });

  describe('removeUrlArguments', () => {
    it('should remove all query parameters from URL and return without http or https', () => {
      const url = 'https://example.com/path?name=value&another=value2';
      const expectedUrl = 'example.com/path';
      const result = service.removeUrlArguments(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should handle URLs without query parameters', () => {
      const url = 'https://example.com/path';
      const expectedUrl = 'example.com/path';
      const result = service.removeUrlArguments(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should handle URLs with only a domain', () => {
      const url = 'https://example.com';
      const expectedUrl = 'example.com';
      const result = service.removeUrlArguments(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should handle URLs with subdomains', () => {
      const url = 'https://sub.example.com/path?name=value';
      const expectedUrl = 'sub.example.com/path';
      const result = service.removeUrlArguments(url);
      expect(result).toEqual(expectedUrl);
    });

    it('should throw InvalidUrl for invalid URLs', () => {
      const url = 'invalid-url';
      expect(() => service.removeUrlArguments(url)).toThrow(InvalidUrl);
    });
  });
});

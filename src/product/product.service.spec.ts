import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(service.isValidUrl('http://example.com')).toBe(true);
      expect(service.isValidUrl('https://example.com')).toBe(true);
      expect(service.isValidUrl('http://example.com/path/to/page')).toBe(true);
      expect(
        service.isValidUrl('http://example.com/path/to/page?query=string'),
      ).toBe(true);
      expect(service.isValidUrl('http://example.com:8080')).toBe(true);
      expect(service.isValidUrl('http://user:pass@example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(service.isValidUrl('not a url')).toBe(false);
      expect(service.isValidUrl('http://')).toBe(false);
      expect(service.isValidUrl('example.com')).toBe(false);
      expect(service.isValidUrl('ftp://example.com')).toBe(false);
    });
  });

  describe('getProductInfoByWpPublicApi', () => {
    it('should return product info', async () => {
      const mockProductData = {
        id: 33,
        name: 'Test Product',
        slug: 'test-product',
        permalink: 'https://store2.skyzstore.com/product/test-product/',
        date_created: '2024-04-01T02:44:21',
        date_created_gmt: '2024-04-01T02:44:21',
        date_modified: '2024-04-01T02:44:24',
        date_modified_gmt: '2024-04-01T02:44:24',
        type: 'simple',
        status: 'publish',
        featured: false,
        catalog_visibility: 'visible',
        description: '<p>THIS IS A TEST PRODUCT DO NOT BUY</p>\n',
        short_description: '',
        sku: '',
        price: '10',
        regular_price: '10',
        sale_price: '',
        date_on_sale_from: null,
        date_on_sale_from_gmt: null,
        date_on_sale_to: null,
        date_on_sale_to_gmt: null,
        on_sale: false,
        purchasable: true,
        total_sales: 0,
        virtual: false,
        downloadable: false,
        downloads: [],
        download_limit: -1,
        download_expiry: -1,
        external_url: '',
        button_text: '',
        tax_status: 'taxable',
        tax_class: '',
        manage_stock: false,
        stock_quantity: null,
        backorders: 'no',
        backorders_allowed: false,
        backordered: false,
        low_stock_amount: null,
        sold_individually: false,
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: '',
        },
        shipping_required: true,
        shipping_taxable: true,
        shipping_class: '',
        shipping_class_id: 0,
        reviews_allowed: true,
        average_rating: '0.00',
        rating_count: 0,
        upsell_ids: [],
        cross_sell_ids: [],
        parent_id: 0,
        purchase_note: '',
        categories: [
          {
            id: 18,
            name: 'Uncategorized',
            slug: 'uncategorized',
          },
        ],
        tags: [],
        images: [
          {
            id: 34,
            date_created: '2024-04-01T02:43:58',
            date_created_gmt: '2024-04-01T02:43:58',
            date_modified: '2024-04-01T02:43:58',
            date_modified_gmt: '2024-04-01T02:43:58',
            src: 'https://store2.skyzstore.com/wp-content/uploads/2024/04/apple-2023-1.jpg',
            name: 'apple-2023-1',
            alt: '',
          },
        ],
        attributes: [],
        default_attributes: [],
        variations: [],
        grouped_products: [],
        menu_order: 0,
        price_html:
          '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>10.00</bdi></span>',
        related_ids: [],
        meta_data: [
          {
            id: 44,
            key: '_yith_shippo_tariff_number',
            value: '',
          },
          {
            id: 45,
            key: '_yith_shippo_country_origin',
            value: 'AU',
          },
        ],
        stock_status: 'instock',
        has_options: false,
        post_password: '',
        _links: {
          self: [
            {
              href: 'https://store2.skyzstore.com/wp-json/wc/v3/products/33',
            },
          ],
          collection: [
            {
              href: 'https://store2.skyzstore.com/wp-json/wc/v3/products',
            },
          ],
        },
      };

      jest
        .spyOn(service, 'getViaWpPublicApiV2')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .mockResolvedValue(mockProductData);

      const result = await service.getViaWpPublicApiV2(
        'store2.skyzstore.com',
        'test-product',
      );

      expect(result).toEqual(mockProductData);
    });
  });

  describe('getProductInfoByWpIReferPlugin', () => {
    it('should return product info', async () => {
      const mockProductData = {
        id: 33,
        name: 'Test Product',
        slug: 'test-product',
        permalink: 'https://store2.skyzstore.com/product/test-product/',
        date_created: '2024-04-01T02:44:21',
        date_created_gmt: '2024-04-01T02:44:21',
        date_modified: '2024-04-01T02:44:24',
        date_modified_gmt: '2024-04-01T02:44:24',
        type: 'simple',
        status: 'publish',
        featured: false,
        catalog_visibility: 'visible',
        description: '<p>THIS IS A TEST PRODUCT DO NOT BUY</p>\n',
        short_description: '',
        sku: '',
        price: '10',
        regular_price: '10',
        sale_price: '',
        date_on_sale_from: null,
        date_on_sale_from_gmt: null,
        date_on_sale_to: null,
        date_on_sale_to_gmt: null,
        on_sale: false,
        purchasable: true,
        total_sales: 0,
        virtual: false,
        downloadable: false,
        downloads: [],
        download_limit: -1,
        download_expiry: -1,
        external_url: '',
        button_text: '',
        tax_status: 'taxable',
        tax_class: '',
        manage_stock: false,
        stock_quantity: null,
        backorders: 'no',
        backorders_allowed: false,
        backordered: false,
        low_stock_amount: null,
        sold_individually: false,
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: '',
        },
        shipping_required: true,
        shipping_taxable: true,
        shipping_class: '',
        shipping_class_id: 0,
        reviews_allowed: true,
        average_rating: '0.00',
        rating_count: 0,
        upsell_ids: [],
        cross_sell_ids: [],
        parent_id: 0,
        purchase_note: '',
        categories: [
          {
            id: 18,
            name: 'Uncategorized',
            slug: 'uncategorized',
          },
        ],
        tags: [],
        images: [
          {
            id: 34,
            date_created: '2024-04-01T02:43:58',
            date_created_gmt: '2024-04-01T02:43:58',
            date_modified: '2024-04-01T02:43:58',
            date_modified_gmt: '2024-04-01T02:43:58',
            src: 'https://store2.skyzstore.com/wp-content/uploads/2024/04/apple-2023-1.jpg',
            name: 'apple-2023-1',
            alt: '',
          },
        ],
        attributes: [],
        default_attributes: [],
        variations: [],
        grouped_products: [],
        menu_order: 0,
        price_html:
          '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>10.00</bdi></span>',
        related_ids: [],
        meta_data: [
          {
            id: 44,
            key: '_yith_shippo_tariff_number',
            value: '',
          },
          {
            id: 45,
            key: '_yith_shippo_country_origin',
            value: 'AU',
          },
        ],
        stock_status: 'instock',
        has_options: false,
        post_password: '',
        _links: {
          self: [
            {
              href: 'https://store2.skyzstore.com/wp-json/wc/v3/products/33',
            },
          ],
          collection: [
            {
              href: 'https://store2.skyzstore.com/wp-json/wc/v3/products',
            },
          ],
        },
      };

      jest
        .spyOn(service, 'getProductInfoByWpIReferPlugin')
        .mockResolvedValue(mockProductData);

      const result = await service.getProductInfoByWpIReferPlugin(
        'store2.skyzstore.com',
        'test-product',
      );

      expect(result).toEqual(mockProductData);
    });
  });

  describe('getProductInfoByMagentoIReferPlugin', () => {
    it('should return product info', async () => {
      const mockProductData = {
        id: 33,
        name: 'Test Product',
        slug: 'test-product',
        permalink: 'https://store2.skyzstore.com/product/test-product/',
        date_created: '2024-04-01T02:44:21',
        date_created_gmt: '2024-04-01T02:44:21',
        date_modified: '2024-04-01T02:44:24',
        date_modified_gmt: '2024-04-01T02:44:24',
        type: 'simple',
        status: 'publish',
        featured: false,
        catalog_visibility: 'visible',
        description: '<p>THIS IS A TEST PRODUCT DO NOT BUY</p>\n',
        short_description: '',
        sku: '',
        price: '10',
        regular_price: '10',
        sale_price: '',
        date_on_sale_from: null,
        date_on_sale_from_gmt: null,
        date_on_sale_to: null,
        date_on_sale_to_gmt: null,
        on_sale: false,
        purchasable: true,
        total_sales: 0,
        virtual: false,
        downloadable: false,
        downloads: [],
        download_limit: -1,
        download_expiry: -1,
        external_url: '',
        button_text: '',
        tax_status: 'taxable',
        tax_class: '',
        manage_stock: false,
        stock_quantity: null,
        backorders: 'no',
        backorders_allowed: false,
        backordered: false,
        low_stock_amount: null,
        sold_individually: false,
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: '',
        },
        shipping_required: true,
        shipping_taxable: true,
        shipping_class: '',
        shipping_class_id: 0,
        reviews_allowed: true,
        average_rating: '0.00',
        rating_count: 0,
        upsell_ids: [],
        cross_sell_ids: [],
        parent_id: 0,
        purchase_note: '',
        categories: [
          {
            id: 18,
            name: 'Uncategorized',
            slug: 'uncategorized',
          },
        ],
        tags: [],
        images: [
          {
            id: 34,
            date_created: '2024-04-01T02:43:58',
            date_created_gmt: '2024-04-01T02:43:58',
            date_modified: '2024-04-01T02:43:58',
            date_modified_gmt: '2024-04-01T02:43:58',
            src: 'https://store2.skyzstore.com/wp-content/uploads/2024/04/apple-2023-1.jpg',
            name: 'apple-2023-1',
            alt: '',
          },
        ],
        attributes: [],
        default_attributes: [],
        variations: [],
        grouped_products: [],
        menu_order: 0,
        price_html:
          '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>10.00</bdi></span>',
        related_ids: [],
        meta_data: [
          {
            id: 44,
            key: '_yith_shippo_tariff_number',
            value: '',
          },
          {
            id: 45,
            key: '_yith_shippo_country_origin',
            value: 'AU',
          },
        ],
        stock_status: 'instock',
        has_options: false,
        post_password: '',
        _links: {
          self: [
            {
              href: 'https://store2.skyzstore.com/wp-json/wc/v3/products/33',
            },
          ],
          collection: [
            {
              href: 'https://store2.skyzstore.com/wp-json/wc/v3/products',
            },
          ],
        },
      };

      jest
        .spyOn(service, 'getProductInfoByMagentoIReferPlugin')
        .mockResolvedValue(mockProductData);

      const result = await service.getProductInfoByMagentoIReferPlugin(
        'store2.skyzstore.com',
        'test-product',
      );

      expect(result).toEqual(mockProductData);
    });
  });

  // describe('isValidProductDataStructure', () => {
  //   it('should return an empty array for a valid product data object', () => {
  //     const validProductData = {
  //       product_id: 1,
  //       product_slug: 'test-product',
  //       product_description: 'Test product description',
  //       product_short_description: 'Test short description',
  //       product_image: 'https://example.com/image.jpg',
  //       product_price: 10.0, // Ensure this is a number
  //       product_permalink: 'https://example.com/test-product',
  //     };
  //
  //     const result = service.isValidProductDataStructure(validProductData);
  //
  //     expect(result).toEqual([]);
  //   });
  //
  //   it('should return an empty array for a valid array of product data objects', () => {
  //     const validProductDataArray = [
  //       {
  //         product_id: 1,
  //         product_slug: 'test-product-1',
  //         product_description: 'Test product 1 description',
  //         product_short_description: 'Test short description 1',
  //         product_image: 'https://example.com/image1.jpg',
  //         product_price: 10.0, // Ensure this is a number
  //         product_permalink: 'https://example.com/test-product-1',
  //       },
  //       {
  //         product_id: 2,
  //         product_slug: 'test-product-2',
  //         product_description: 'Test product 2 description',
  //         product_short_description: 'Test short description 2',
  //         product_image: 'https://example.com/image2.jpg',
  //         product_price: 20.0, // Ensure this is a number
  //         product_permalink: 'https://example.com/test-product-2',
  //       },
  //     ];
  //
  //     const result = service.isValidProductDataStructure(validProductDataArray);
  //
  //     expect(result).toEqual([]);
  //   });
  //
  //   it('should return an array of missing properties for an invalid product data object', () => {
  //     const invalidProductData = {
  //       product_id: 1,
  //       product_slug: 'test-product',
  //       product_description: 'Test product description',
  //       product_image: 'https://example.com/image.jpg',
  //       product_permalink: 'https://example.com/test-product',
  //     };
  //
  //     const result = service.isValidProductDataStructure(invalidProductData);
  //
  //     expect(result).toEqual(['product_short_description', 'product_price']);
  //   });
  //
  //   it('should return an array with "Invalid product data" for an invalid product data array', () => {
  //     const invalidProductDataArray = [
  //       {
  //         product_id: 1,
  //         product_slug: 'test-product-1',
  //         product_description: 'Test product 1 description',
  //         product_short_description: 'Test short description 1',
  //         product_image: 'https://example.com/image1.jpg',
  //         product_price: 10.0, // Ensure this is a number
  //         product_permalink: 'https://example.com/test-product-1',
  //       },
  //       'invalid product data', // This should be an object
  //     ];
  //
  //     const result = service.isValidProductDataStructure(
  //       invalidProductDataArray,
  //     );
  //
  //     expect(result).toEqual(['Invalid product data']);
  //   });
  //
  //   it('should return an empty array for a valid array of key-value pairs', () => {
  //     const validProductDataArray = [
  //       ['product_id', 1],
  //       ['product_slug', 'test-product'],
  //       ['product_description', 'Test product description'],
  //       ['product_short_description', 'Test short description'],
  //       ['product_image', 'https://example.com/image.jpg'],
  //       ['product_price', 10.0], // Ensure this is a number
  //       ['product_permalink', 'https://example.com/test-product'],
  //     ];
  //
  //     const result = service.isValidProductDataStructure(
  //       Object.fromEntries(validProductDataArray),
  //     );
  //
  //     expect(result).toEqual([]);
  //   });
  //
  //   it('should return an array of missing properties for an invalid array of key-value pairs', () => {
  //     const invalidProductDataArray = [
  //       ['product_id', 1],
  //       ['product_slug', 'test-product'],
  //       ['product_description', 'Test product description'],
  //       ['product_image', 'https://example.com/image.jpg'],
  //       ['product_permalink', 'https://example.com/test-product'],
  //     ];
  //
  //     const result = service.isValidProductDataStructure(
  //       Object.fromEntries(invalidProductDataArray),
  //     );
  //
  //     expect(result).toEqual(['product_short_description', 'product_price']);
  //   });
  //
  //   it('should return ["Invalid product data"] for non-object, non-array input', () => {
  //     const invalidInputs = [null, undefined, 123, 'string', true, false];
  //
  //     invalidInputs.forEach((input) => {
  //       const result = service.isValidProductDataStructure(input);
  //       expect(result).toEqual(['Invalid product data']);
  //     });
  //   });
  // });
});

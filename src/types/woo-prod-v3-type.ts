import * as t from 'io-ts';

const WooProductDimensionsCodec = t.type({
  length: t.string,
  width: t.string,
  height: t.string,
});

const WooProductCategoryCodec = t.type({
  id: t.number,
  name: t.string,
  slug: t.string,
});

const WooProductImageCodec = t.type({
  id: t.number,
  date_created: t.string,
  date_created_gmt: t.string,
  date_modified: t.string,
  date_modified_gmt: t.string,
  src: t.string,
  name: t.string,
  alt: t.string,
});

const WooProductCategoriesCodec = t.array(WooProductCategoryCodec);
const WooProductImagesCodec = t.array(WooProductImageCodec);
const WooProductTagsCodec = t.array(t.unknown);
const WooProductUpsellIdsCodec = t.array(t.number);
const WooProductCrossSellIdsCodec = t.array(t.number);
const WooProductRelatedIdsCodec = t.array(t.unknown);

const WooProductV3Codec = t.type({
  id: t.number,
  name: t.string,
  slug: t.string,
  permalink: t.string,
  date_created: t.string,
  date_created_gmt: t.string,
  date_modified: t.string,
  date_modified_gmt: t.string,
  type: t.string,
  status: t.string,
  featured: t.boolean,
  catalog_visibility: t.string,
  description: t.string,
  short_description: t.string,
  sku: t.string,
  price: t.string,
  regular_price: t.string,
  sale_price: t.string,
  date_on_sale_from: t.union([t.string, t.null]),
  date_on_sale_from_gmt: t.union([t.string, t.null]),
  date_on_sale_to: t.union([t.string, t.null]),
  date_on_sale_to_gmt: t.union([t.string, t.null]),
  on_sale: t.boolean,
  purchasable: t.boolean,
  total_sales: t.number,
  virtual: t.boolean,
  downloadable: t.boolean,
  downloads: t.array(t.unknown),
  download_limit: t.number,
  download_expiry: t.number,
  external_url: t.string,
  button_text: t.string,
  tax_status: t.string,
  tax_class: t.string,
  manage_stock: t.boolean,
  stock_quantity: t.union([t.number, t.null]),
  low_stock_amount: t.union([t.number, t.null]),
  sold_individually: t.boolean,
  weight: t.string,
  dimensions: WooProductDimensionsCodec,
  shipping_required: t.boolean,
  shipping_taxable: t.boolean,
  shipping_class: t.string,
  shipping_class_id: t.number,
  reviews_allowed: t.boolean,
  average_rating: t.string,
  rating_count: t.number,
  upsell_ids: WooProductUpsellIdsCodec,
  cross_sell_ids: WooProductCrossSellIdsCodec,
  parent_id: t.number,
  purchase_note: t.string,
  categories: WooProductCategoriesCodec,
  tags: WooProductTagsCodec,
  images: WooProductImagesCodec,
  price_html: t.string,
  related_ids: WooProductRelatedIdsCodec,
  stock_status: t.string,
  has_options: t.boolean,
  post_password: t.string,
});

type WooProductV3Type = t.TypeOf<typeof WooProductV3Codec>;
type WooProductV3ImageType = t.TypeOf<typeof WooProductImageCodec>;
type WooProductV3CategoryType = t.TypeOf<typeof WooProductCategoryCodec>;

export {
  WooProductV3Codec,
  WooProductV3Type,
  WooProductDimensionsCodec,
  WooProductCategoryCodec,
  WooProductV3CategoryType,
  WooProductImageCodec,
  WooProductV3ImageType,
  WooProductCategoriesCodec,
  WooProductImagesCodec,
  WooProductTagsCodec,
  WooProductUpsellIdsCodec,
  WooProductCrossSellIdsCodec,
  WooProductRelatedIdsCodec,
};

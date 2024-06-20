import * as t from 'io-ts';

const MagentoProductCodec = t.type({
  id: t.number,
  name: t.string,
  slug: t.string,
  permalink: t.string,
  date_created: t.string,
  date_modified: t.string,
  type: t.string,
  status: t.string,
  description: t.string,
  short_description: t.string,
  sku: t.string,
  price: t.number,
  regular_price: t.number,
  sale_price: t.number,
  images: t.array(t.string),
});

type MagentoProductType = t.TypeOf<typeof MagentoProductCodec>;

const MagentoProductsCodec = t.array(MagentoProductCodec);

type MagentoProductsType = t.TypeOf<typeof MagentoProductsCodec>;

export {
  MagentoProductCodec,
  MagentoProductType,
  MagentoProductsCodec,
  MagentoProductsType,
};

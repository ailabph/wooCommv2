import * as t from 'io-ts';

const WooProductTitleCodec = t.type({
  rendered: t.string,
});

const WooProductContentCodec = t.type({
  rendered: t.string,
  protected: t.boolean,
});

const WooProductExcerptCodec = t.type({
  rendered: t.string,
  protected: t.boolean,
});

const WooProductCatCodec = t.array(t.number);

const WooProductCodec = t.type({
  id: t.number,
  date: t.string,
  date_gmt: t.string,
  modified: t.string,
  modified_gmt: t.string,
  slug: t.string,
  status: t.string,
  type: t.string,
  link: t.string,
  title: WooProductTitleCodec,
  content: WooProductContentCodec,
  excerpt: WooProductExcerptCodec,
  product_cat: WooProductCatCodec,
});

type WooProductType = t.TypeOf<typeof WooProductCodec>;

const WooProductTypesCodec = t.array(WooProductCodec);

type WooProductsType = t.TypeOf<typeof WooProductTypesCodec>;

export {
  WooProductTypesCodec,
  WooProductsType,
  WooProductCodec,
  WooProductType,
  WooProductTitleCodec,
  WooProductContentCodec,
  WooProductExcerptCodec,
  WooProductCatCodec,
};

import * as t from 'io-ts';

const VendorKeyCodec = t.type({
  session_id: t.union([t.string, t.undefined]),
  state: t.union([t.string, t.undefined]),
  is_online: t.union([t.boolean, t.undefined]),
  access_token: t.union([t.string, t.undefined]),
  expires_at: t.union([t.string, t.undefined]),
  scope: t.union([t.string, t.undefined]),
  consumer_key: t.string,
  shop: t.string,
  consumer_secret: t.string,
  endpoint_url: t.union([t.string, t.undefined]),
  platform: t.union([t.string, t.undefined]),
});

type VendorKeyType = t.TypeOf<typeof VendorKeyCodec>;

export { VendorKeyCodec, VendorKeyType };

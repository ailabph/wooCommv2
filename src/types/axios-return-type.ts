import * as t from 'io-ts';

const AxiosReturnCodec = t.type({
  data: t.unknown,
  status: t.number,
  statusText: t.string,
  headers: t.unknown,
  config: t.unknown,
  request: t.unknown,
});

type AxiosReturn = t.TypeOf<typeof AxiosReturnCodec>;
export { AxiosReturn, AxiosReturnCodec };

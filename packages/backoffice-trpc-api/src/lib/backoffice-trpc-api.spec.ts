import { backofficeTrpcApi } from './backoffice-trpc-api';

describe('backofficeTrpcApi', () => {
  it('should work', () => {
    expect(backofficeTrpcApi()).toEqual('backoffice-trpc-api');
  });
});

import { databasesBackofficeDb } from './databases-backoffice-db';

describe('databasesBackofficeDb', () => {
  it('should work', () => {
    expect(databasesBackofficeDb()).toEqual('databases-backoffice-db');
  });
});

import { SQSEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { handler } from './process-order-payment';

jest.mock('~/api/postgres/connection');
jest.mock('~/api/postgres/pool');
jest.mock('~/api/postgres/pool-factory');
jest.mock('~/use-cases/order/update-status');

describe('process order payment handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call process order payment worker', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    await handler({
      Records: [
        {
          body: JSON.stringify({
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            amount: 20.99,
            status: 'PAID',
            order: { id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e' },
            createdAt: '2024-07-12T22:18:26.351Z',
            updatedAt: '2024-07-12T22:18:26.351Z',
            externalId: 12345,
          }),
        },
      ],
    } as unknown as SQSEvent);
  });
});

import { Message } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';
import { ProcessOrderPaymentWorker } from './process-payment';

describe('process order payment', () => {
  let updateOrderStatusUseCase: MockProxy<UpdateOrderStatusUseCase>;
  let processOrderPaymentWorker: ProcessOrderPaymentWorker;

  beforeAll(() => {
    updateOrderStatusUseCase = mock();
    processOrderPaymentWorker = new ProcessOrderPaymentWorker(
      updateOrderStatusUseCase,
    );
  });

  it('should process order payment successfully', async () => {
    updateOrderStatusUseCase.execute.mockResolvedValue(makeOrder());

    await processOrderPaymentWorker.handler([
      {
        body: {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          amount: 20.99,
          status: 'PAID',
          order: { id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e' },
          createdAt: '2024-07-12T22:18:26.351Z',
          updatedAt: '2024-07-12T22:18:26.351Z',
          externalId: 12345,
        },
      },
    ] as unknown as Message<any>[]);

    expect(updateOrderStatusUseCase.execute).toHaveBeenNthCalledWith(1, {
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      status: 'RECEIVED',
    });
  });
});

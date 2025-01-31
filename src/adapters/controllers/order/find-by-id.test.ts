import { Request } from '@cloud-burger/handlers';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { FindOrderByIdUseCase } from '~/use-cases/order/find-by-id';
import { FindOrderByIdController } from './find-by-id';

describe('find order by id controller', () => {
  let findOrderByIdUseCase: MockProxy<FindOrderByIdUseCase>;
  let findOrderByIdController: FindOrderByIdController;

  beforeAll(() => {
    findOrderByIdUseCase = mock();
    findOrderByIdController = new FindOrderByIdController(findOrderByIdUseCase);
  });

  it('should throw validation error when has validation errors', async () => {
    try {
      await findOrderByIdController.handler({} as unknown as Request);
    } catch (error) {
      expect(error.toObject()).toEqual({
        invalidParams: [
          { name: 'id', reason: 'id is required', value: undefined },
        ],
        reason: 'Invalid request data',
      });
    }

    expect(findOrderByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should update order status successfully', async () => {
    findOrderByIdUseCase.execute.mockResolvedValue(makeOrder());

    const response = await findOrderByIdController.handler({
      params: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
      pathParameters: {
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      },
    } as unknown as Request);

    expect(response).toEqual({
      body: {
        amount: 20.99,
        customer: {
          documentNumber: '53523992060',
          email: 'johndue@gmail.com',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          name: 'John Due',
        },
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        number: 123,
        products: [
          {
            amount: 20.99,
            category: 'BURGER',
            description:
              'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
            id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
            name: 'Bacon Burger',
            notes: 'Sem bacon',
            quantity: 1,
          },
        ],
        status: 'RECEIVED',
      },
      statusCode: 200,
    });
    expect(findOrderByIdUseCase.execute).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
  });
});

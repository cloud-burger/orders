import { mock, MockProxy } from 'jest-mock-extended';
import { makeOrder } from 'tests/factories/make-order';
import { OrderRepository } from '~/domain/repositories/order';
import { FindOrderByIdUseCase } from './find-by-id';

describe('find order by id use case', () => {
  let orderRepository: MockProxy<OrderRepository>;
  let findOrderById: FindOrderByIdUseCase;

  beforeAll(() => {
    orderRepository = mock();
    findOrderById = new FindOrderByIdUseCase(orderRepository);
  });

  it('should throw not found when order does not exists', async () => {
    orderRepository.findById.mockResolvedValue(null);

    await expect(findOrderById.execute('123')).rejects.toThrow(
      'Order not found',
    );

    expect(orderRepository.findById).toHaveBeenNthCalledWith(1, '123');
  });

  it('should find order by id successfully', async () => {
    orderRepository.findById.mockResolvedValue(makeOrder());

    const order = await findOrderById.execute(
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );

    expect(order).toEqual({
      amount: 20.99,
      createdAt: new Date('2024-07-12T22:18:26.351Z'),
      customer: {
        createdAt: new Date('2024-07-12T22:18:26.351Z'),
        documentNumber: '53523992060',
        email: 'johndue@gmail.com',
        id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
        name: 'John Due',
        updatedAt: new Date('2024-07-12T22:18:26.351Z'),
      },
      id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
      number: 123,
      products: [
        {
          amount: 20.99,
          category: 'BURGER',
          createdAt: new Date('2024-07-12T22:18:26.351Z'),
          description:
            'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue.',
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          image: null,
          name: 'Bacon Burger',
          notes: 'Sem bacon',
          quantity: 1,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'RECEIVED',
      updatedAt: new Date('2024-07-12T22:18:26.351Z'),
    });
    expect(orderRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
  });
});

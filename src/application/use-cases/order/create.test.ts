import { mock, MockProxy } from 'jest-mock-extended';
import { makeProduct } from 'tests/factories/make-product';
import { OrderRepository } from '~/domain/repositories/order';
import { ProductRepository } from '~/domain/repositories/product';
import { CreateOrderUseCase } from './create';

describe('create order use case', () => {
  let orderRepository: MockProxy<OrderRepository>;
  let productRepository: MockProxy<ProductRepository>;
  let createOrderUseCase: CreateOrderUseCase;

  beforeAll(() => {
    orderRepository = mock();
    productRepository = mock();
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      productRepository,
    );
  });

  it('should throw when product not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      createOrderUseCase.execute({
        products: [
          {
            id: '123',
            notes: 'no ice',
            quantity: 2,
          },
        ],
      }),
    ).rejects.toThrow('Product not found');

    expect(productRepository.findById).toHaveBeenNthCalledWith(1, '123');
    expect(orderRepository.create).not.toHaveBeenCalled();
  });

  it('should create order successfully', async () => {
    productRepository.findById.mockResolvedValue(makeProduct());
    orderRepository.create.mockResolvedValue(123);

    const order = await createOrderUseCase.execute({
      products: [
        {
          id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
          quantity: 2,
          notes: 'no ice',
        },
      ],
    });

    expect(order).toEqual({
      amount: 41.98,
      createdAt: expect.any(Date),
      customer: null,
      number: 123,
      id: expect.any(String),
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
          notes: 'no ice',
          quantity: 2,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
    expect(productRepository.findById).toHaveBeenNthCalledWith(
      1,
      'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    );
    expect(orderRepository.create).toHaveBeenNthCalledWith(1, {
      amount: 41.98,
      createdAt: expect.any(Date),
      number: 123,
      customer: null,
      id: expect.any(String),
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
          notes: 'no ice',
          quantity: 2,
          updatedAt: new Date('2024-07-12T22:18:26.351Z'),
        },
      ],
      status: 'WAITING_PAYMENT',
      updatedAt: expect.any(Date),
    });
  });
});

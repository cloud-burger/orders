import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Order } from '~/domain/entities/order';
import { OrderRepository } from '~/domain/repositories/order';

export class FindOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      logger.warn({
        message: 'Order not found',
        data: id,
      });

      throw new NotFoundError('Order not found');
    }

    return order;
  }
}

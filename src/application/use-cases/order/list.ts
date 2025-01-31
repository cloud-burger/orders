import { Order } from '~/domain/entities/order';
import {
  OrderPaginationParams,
  OrderRepository,
} from '~/domain/repositories/order';

export class ListOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(input: OrderPaginationParams): Promise<Order[]> {
    return await this.orderRepository.findMany(input);
  }
}

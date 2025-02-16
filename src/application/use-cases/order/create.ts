import { NotFoundError } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Order } from '~/domain/entities/order';
import { OrderRepository } from '~/domain/repositories/order';
import { ProductRepository } from '~/domain/repositories/product';

interface Input {
  products: Partial<ProductInput>[];
}

interface ProductInput {
  id: string;
  quantity: number;
  notes?: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute({ products }: Input): Promise<Order> {
    const order = new Order();

    for (const product of products) {
      const dataProduct = await this.productRepository.findById(product.id);

      if (!dataProduct) {
        logger.warn({
          message: 'Product not found',
          data: product,
        });
        throw new NotFoundError('Product not found');
      }

      dataProduct.setQuantity(product.quantity);
      dataProduct.setNotes(product.notes);

      order.addProduct(dataProduct);
    }

    order.calculateAmount();

    logger.debug({
      message: 'Creating order',
      data: order,
    });

    const orderNumber = await this.orderRepository.create(order);

    order.setNumber(orderNumber);

    return order;
  }
}

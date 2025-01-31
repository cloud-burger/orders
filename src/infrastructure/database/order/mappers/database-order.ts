import { Order } from '~/domain/entities/order';
import { Product } from '~/domain/entities/product';
import { OrderStatus } from '~/domain/entities/value-objects/enums/order-status';
import { ProductCategory } from '~/domain/entities/value-objects/enums/product-category';
import { OrderDbSchema, OrdersDbSchema } from '../dtos/orders-db-schema';

export class DatabaseOrderMapper {
  static toDomain(orderDbSchema: OrdersDbSchema): Order {
    return new Order({
      id: orderDbSchema.id,
      amount: orderDbSchema.amount,
      customer: orderDbSchema.customer_id
        ? {
            id: orderDbSchema.customer_id,
          }
        : null,
      status: orderDbSchema.status as OrderStatus,
      createdAt: new Date(orderDbSchema.created_at),
      updatedAt: new Date(orderDbSchema.updated_at),
      number: orderDbSchema.number,
      products: orderDbSchema.products.map((product) => {
        return new Product({
          id: product.id,
          amount: +product.amount,
          category: product.category as ProductCategory,
          description: product.description,
          name: product.name,
          image: product.image,
          quantity: product.quantity,
          notes: product.notes,
          createdAt: new Date(product.created_at),
          updatedAt: new Date(product.updated_at),
        });
      }),
    });
  }

  static toDatabase(order: Order): OrderDbSchema {
    return {
      id: order.id,
      amount: order.amount,
      customer_id: order.customer?.id || null,
      status: order.status,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
      products: order.products.map((product) => ({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        notes: product.notes || null,
      })),
    };
  }
}

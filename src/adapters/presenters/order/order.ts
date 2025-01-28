import { getFormattedCurrency } from '~/controllers/helpers/currency';
import { removeNullValues } from '~/controllers/helpers/remove-null-values';
import { Order } from '~/domain/entities/order';
import { ProductPresenter } from '../product/product';
import { OrderResponse } from './dtos/order-response';

export class OrderPresenter {
  static toHttp(order: Order): OrderResponse {
    return removeNullValues({
      id: order.id,
      number: order.number,
      amount: getFormattedCurrency(order.amount),
      status: order.status,
      products: order.products.map((product) =>
        ProductPresenter.toHttp(product),
      ),
      customer: order.customer
        ? {
            id: order.customer.id,
            documentNumber: order.customer.documentNumber,
            email: order.customer.email,
            name: order.customer.name,
          }
        : null,
    });
  }
}

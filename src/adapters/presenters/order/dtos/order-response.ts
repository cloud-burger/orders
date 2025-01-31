import { OrderStatus } from '~/domain/entities/value-objects/enums/order-status';
import { ProductResponse } from '../../product/dtos/product-response';

export interface OrderResponse {
  id: string;
  amount: string;
  number: number;
  customer?: CustomerResponse;
  status: OrderStatus;
  products: ProductResponse[];
}

interface CustomerResponse {
  id: string;
  documentNumber: string;
  name: string;
  email: string;
}

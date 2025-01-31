import { Product } from '~/domain/entities/product';
import { ProductResponse } from './dtos/product-response';
import { ProductPresenter } from './product';

export class FindProductsByCategoryPresenter {
  static toHttp(products: Product[]): ProductResponse[] {
    return products.map((product) => ProductPresenter.toHttp(product));
  }
}

import { Product } from '~/domain/entities/product';
import { ProductCategory } from '~/domain/entities/value-objects/enums/product-category';
import { ProductRepository } from '~/domain/repositories/product';

interface Input {
  category: ProductCategory;
}

export class FindProductsByCategoryUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ category }: Input): Promise<Product[]> {
    return await this.productRepository.findByCategory(category);
  }
}

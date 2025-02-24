import { Controller, Request, Response } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { ProductCategory } from '~/domain/entities/value-objects/enums/product-category';
import { ProductResponse } from '~/presenters/product/dtos/product-response';
import { FindProductsByCategoryPresenter } from '~/presenters/product/find-products-by-category';
import { FindProductsByCategoryUseCase } from '~/use-cases/product/find-by-category';

export class FindProductsByCategoryController {
  constructor(
    private findProductsByCategoryUseCase: FindProductsByCategoryUseCase,
  ) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<ProductResponse[]>> => {
    const { category } = request.query;

    logger.info({
      message: 'Find product by category request',
      data: request,
    });

    const products = await this.findProductsByCategoryUseCase.execute({
      category: category as ProductCategory,
    });

    logger.info({
      message: 'Find product by category response',
      data: products,
    });

    return {
      statusCode: 200,
      body: FindProductsByCategoryPresenter.toHttp(products),
    };
  };
}

import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { DeleteProductController } from '~/controllers/product/delete';
import { ProductRepository } from '~/infrastructure/database/product/product-repository';
import { DeleteProductUseCase } from '~/use-cases/product/delete';

let pool: Pool;
let productRepository: ProductRepository;
let deleteProductUseCase: DeleteProductUseCase;
let deleteProductController: DeleteProductController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  deleteProductUseCase = new DeleteProductUseCase(productRepository);
  deleteProductController = new DeleteProductController(deleteProductUseCase);
  apiHandler = new ApiHandler(deleteProductController.handler);
};

export const deleteProduct = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  logger.setEvent('orders', request);
  logger.debug({
    message: 'Event received',
    data: request,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await apiHandler.handler(request, response);
  } finally {
    connection.release();
  }
};

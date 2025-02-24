import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { UpdateProductController } from '~/controllers/product/update';
import { ProductRepository } from '~/infrastructure/database/product/product-repository';
import { UpdateProductUseCase } from '~/use-cases/product/update';

let pool: Pool;
let productRepository: ProductRepository;
let updateProductUseCase: UpdateProductUseCase;
let updateProductController: UpdateProductController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  updateProductUseCase = new UpdateProductUseCase(productRepository);
  updateProductController = new UpdateProductController(updateProductUseCase);
  apiHandler = new ApiHandler(updateProductController.handler);
};

export const updateProduct = async (
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

import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { CreateProductController } from '~/controllers/product/create';
import { ProductRepository } from '~/infrastructure/database/product/product-repository';
import { CreateProductUseCase } from '~/use-cases/product/create';

let pool: Pool;
let productRepository: ProductRepository;
let createProductUseCase: CreateProductUseCase;
let createProductController: CreateProductController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  productRepository = new ProductRepository(connection);
  createProductUseCase = new CreateProductUseCase(productRepository);
  createProductController = new CreateProductController(createProductUseCase);
  apiHandler = new ApiHandler(createProductController.handler);
};

export const createProduct = async (
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

import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { CreateOrderController } from '~/controllers/order/create';
import { OrderRepository } from '~/infrastructure/database/order/order-repository';
import { ProductRepository } from '~/infrastructure/database/product/product-repository';
import { CreateOrderUseCase } from '~/use-cases/order/create';

let pool: Pool;
let orderRepository: OrderRepository;
let productRepository: ProductRepository;
let createOrderUseCase: CreateOrderUseCase;
let createOrderController: CreateOrderController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  productRepository = new ProductRepository(connection);
  createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    productRepository,
  );
  createOrderController = new CreateOrderController(createOrderUseCase);
  apiHandler = new ApiHandler(createOrderController.handler);
};

export const createOrder = async (
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

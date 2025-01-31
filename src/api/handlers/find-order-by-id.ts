import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { FindOrderByIdController } from '~/controllers/order/find-by-id';
import { OrderRepository } from '~/infrastructure/database/order/order-repository';
import { FindOrderByIdUseCase } from '~/use-cases/order/find-by-id';

let pool: Pool;
let orderRepository: OrderRepository;
let findOrderByIdUseCase: FindOrderByIdUseCase;
let findOrderByIdController: FindOrderByIdController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  findOrderByIdUseCase = new FindOrderByIdUseCase(orderRepository);
  findOrderByIdController = new FindOrderByIdController(findOrderByIdUseCase);
  apiHandler = new ApiHandler(findOrderByIdController.handler);
};

export const findOrderById = async (
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

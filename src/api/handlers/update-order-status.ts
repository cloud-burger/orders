import { ApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { Request, Response } from 'express';
import Connection from '~/api/postgres/connection';
import Pool from '~/api/postgres/pool';
import { PoolFactory } from '~/api/postgres/pool-factory';
import { UpdateOrderStatusController } from '~/controllers/order/update-status';
import { OrderRepository } from '~/infrastructure/database/order/order-repository';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';

let pool: Pool;
let orderRepository: OrderRepository;
let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let updateOrderStatusController: UpdateOrderStatusController;
let apiHandler: ApiHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  updateOrderStatusController = new UpdateOrderStatusController(
    updateOrderStatusUseCase,
  );
  apiHandler = new ApiHandler(updateOrderStatusController.handler);
};

export const updateOrderStatus = async (
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

import { LambdaSqsHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { SQSEvent } from 'aws-lambda';
import { OrderRepository } from '~/infrastructure/database/order/order-repository';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';
import { ProcessOrderPaymentWorker } from '~/workers/order/process-payment';
import Connection from '../postgres/connection';
import Pool from '../postgres/pool';
import { PoolFactory } from '../postgres/pool-factory';

let pool: Pool;
let orderRepository: OrderRepository;
let updateOrderStatusUseCase: UpdateOrderStatusUseCase;
let processOrderPaymentWorker: ProcessOrderPaymentWorker;
let lambdaSqsHandler: LambdaSqsHandler;

const setDependencies = (connection: Connection) => {
  orderRepository = new OrderRepository(connection);
  updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  processOrderPaymentWorker = new ProcessOrderPaymentWorker(
    updateOrderStatusUseCase,
  );
  lambdaSqsHandler = new LambdaSqsHandler(processOrderPaymentWorker.handler);
};

export const handler = async (event: SQSEvent): Promise<void> => {
  logger.setService('orders');
  logger.debug({
    message: 'Event received',
    data: event,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await lambdaSqsHandler.handler(event);
  } finally {
    connection.release();
  }
};

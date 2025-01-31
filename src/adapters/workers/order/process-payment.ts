import { Message, Worker } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { OrderStatus } from '~/domain/entities/value-objects/enums/order-status';
import { UpdateOrderStatusUseCase } from '~/use-cases/order/update-status';

interface Input {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  externalId: number;
  order: {
    id: string;
  };
}

export class ProcessOrderPaymentWorker {
  constructor(private updateOrderStatusUseCase: UpdateOrderStatusUseCase) {}

  handler: Worker<Input> = async (
    messages: Message<Input>[],
  ): Promise<void> => {
    await Promise.all(
      messages.map(async (message) => {
        logger.debug({
          message: 'Process order payment request',
          data: message,
        });

        const order = await this.updateOrderStatusUseCase.execute({
          id: message.body.order.id,
          status: OrderStatus.RECEIVED,
        });

        logger.debug({
          message: 'Process order payment response',
          data: order,
        });
      }),
    );
  };
}

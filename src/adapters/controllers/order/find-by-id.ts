import {
  Controller,
  Request,
  Response,
  ValidationError,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { validateSchema } from '@cloud-burger/utils';
import { OrderResponse } from '~/presenters/order/dtos/order-response';
import { OrderPresenter } from '~/presenters/order/order';
import { FindOrderByIdUseCase } from '~/use-cases/order/find-by-id';
import { findOrderByIdSchema } from './validations/find-order-by-id-schema';

export class FindOrderByIdController {
  constructor(private readonly findOrderByIdUseCase: FindOrderByIdUseCase) {}

  handler: Controller = async (
    request: Request,
  ): Promise<Response<OrderResponse>> => {
    const { params } = request;

    logger.info({
      message: 'Find order by id request',
      data: request,
    });

    const { data, errors } = validateSchema(findOrderByIdSchema, {
      ...params,
    });

    const hasValidationErrors = errors?.length;

    if (hasValidationErrors) {
      logger.warn({
        message: 'Update order status validation error',
        data: errors,
      });

      throw new ValidationError('Invalid request data', errors);
    }

    const { id } = data;

    const order = await this.findOrderByIdUseCase.execute(id);

    logger.info({
      message: 'Find order by id response',
      data: order,
    });

    return {
      statusCode: 200,
      body: OrderPresenter.toHttp(order),
    };
  };
}

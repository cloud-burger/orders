import Joi from 'joi';

export const findOrderByIdSchema = Joi.object({
  id: Joi.string().guid().required(),
}).required();

import Joi from 'joi';

export const loginSchema = Joi.object({
  login: Joi.string().min(6).max(50).required(),
});

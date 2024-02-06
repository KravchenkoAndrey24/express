import Joi from 'joi';

export const authSchema = Joi.object({
  login: Joi.string().min(6).max(50).required(),
  password: Joi.string().min(6).max(30).required(),
});

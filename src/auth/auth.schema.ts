import Joi from 'joi';

export const authSchema = Joi.object({
  email: Joi.string().min(6).max(50).email().required(),
  password: Joi.string().min(6).max(30).required(),
});

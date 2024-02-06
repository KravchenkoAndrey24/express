import Joi from 'joi';

export const userSchema = Joi.object({
  login: Joi.string().min(6).max(50).required(),
});

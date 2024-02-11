import Joi from 'joi';

export const authSchema = Joi.object({
  email: Joi.string().min(6).max(50).email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const forgotPasswordStep2Schema = Joi.object({
  email: Joi.string().min(6).max(50).email().required(),
  newPassword: Joi.string().min(6).max(30).required(),
  token: Joi.string().required(),
});

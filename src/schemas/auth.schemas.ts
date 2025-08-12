import Joi from 'joi';

export const signinSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .required()
});

export const signupSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .required(),
  username: Joi.string()
    .min(3)
    .max(30)
    .optional(),
  name: Joi.string()
    .min(1)
    .max(60)
    .optional()
});

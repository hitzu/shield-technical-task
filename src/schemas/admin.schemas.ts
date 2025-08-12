import Joi from 'joi';

export const rateLimitResetSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional()
});

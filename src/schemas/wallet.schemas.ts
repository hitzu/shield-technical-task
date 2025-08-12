import Joi from 'joi';

export const walletUpsertSchema = Joi.object({
  tag: Joi.string()
    .optional()
    .allow(null, ''),
  chain: Joi.string().required(),
  address: Joi.string().required()
});

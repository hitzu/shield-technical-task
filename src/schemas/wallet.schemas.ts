import Joi from 'joi';

export const walletUpsertSchema = Joi.object({
  tag: Joi.string()
    .optional()
    .allow(null, ''),
  chain: Joi.string().required(),
  address: Joi.string().required()
});

/**
 * Future enhancement (example, kept commented to avoid impacting current tests):
 *
 * 1) Restrict `chain` to a catalog (enum) and validate `address` per-chain.
 * 2) Normalize formats (e.g., trim, enforce hex prefix for EVM, etc.).
 *
 * Example (minimal draft):
 *
 * const ALLOWED_CHAINS = ['ethereum', 'bitcoin', 'tron'] as const;
 *
 * const isHexAddress = (value: string): boolean => /^0x[0-9a-fA-F]{40}$/.test(value);
 *
 * export const walletUpsertSchema = Joi.object({
 *   tag: Joi.string().optional().allow(null, ''),
 *   chain: Joi.string().valid(...ALLOWED_CHAINS).required(),
 *   address: Joi.string().trim().required()
 * }).custom((value, helpers) => {
 *   const chain = String(value.chain || '').toLowerCase();
 *   const address = String(value.address || '');
 *
 *   if (chain === 'ethereum') {
 *     if (!isHexAddress(address)) {
 *       return helpers.error('any.invalid', { message: 'Invalid EVM address' });
 *     }
 *   } else if (chain === 'tron') {
 *     // If TronWeb is available: TronWeb.isAddress(address)
 *   } else if (chain === 'bitcoin') {
 *     // Consider a dedicated validator (bech32/P2PKH/P2SH)…
 *   }
 *
 *   return value;
 * });
 */

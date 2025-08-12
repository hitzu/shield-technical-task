import Express from 'express';
import { verifyToken } from '../middlewares/authenticator';
import { validateSchema } from '../middlewares/validate-input-schema';
import { walletUpsertSchema } from '../schemas';
import {
  listWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet
} from '../controllers/wallet.controller';

const api = Express.Router();

api.use(verifyToken());
api.get('/wallets', listWallets);
api.post('/wallets', validateSchema(walletUpsertSchema, 'body'), createWallet);
api.get('/wallets/:id', getWallet);
api.put(
  '/wallets/:id',
  validateSchema(walletUpsertSchema, 'body'),
  updateWallet
);
api.delete('/wallets/:id', deleteWallet);

export default api;

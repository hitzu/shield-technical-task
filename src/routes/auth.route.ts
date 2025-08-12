import Express from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller';
import { resetRateLimit } from '../controllers/admin.controller';
import { validateSchema } from '../middlewares/validate-input-schema';
import { verifyToken } from '../middlewares/authenticator';
import { signinSchema, signupSchema } from '../schemas';
import { rateLimitSignin } from '../middlewares/rate-limit';
import { rateLimitResetSchema } from '../schemas/admin.schemas';

const api = Express.Router();

api.post(
  '/signin',
  validateSchema(signinSchema, 'body'),
  rateLimitSignin(),
  signIn
);
api.post('/signup', validateSchema(signupSchema, 'body'), signUp);
api.post('/signout', verifyToken(), signOut);
api.post(
  '/ratelimit/reset',
  validateSchema(rateLimitResetSchema, 'body'),
  resetRateLimit
);

export default api;

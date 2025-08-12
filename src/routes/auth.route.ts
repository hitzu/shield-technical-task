import { Router } from 'express';

import { resetRateLimit } from '../controllers/admin.controller';
import { signIn, signOut, signUp } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/authenticator';
import { rateLimitSignin } from '../middlewares/rate-limit';
import { validateSchema } from '../middlewares/validate-input-schema';
import { signinSchema, signupSchema } from '../schemas';
import { rateLimitResetSchema } from '../schemas/admin.schemas';

const api = Router();

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

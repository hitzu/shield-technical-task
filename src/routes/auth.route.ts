import Express from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller';
import { validateSchema } from '../middlewares/validate-input-schema';
import { verifyToken } from '../middlewares/authenticator';
import { signinSchema, signupSchema } from '../schemas';

const api = Express.Router();

api.post('/signin', validateSchema(signinSchema, 'body'), signIn);
api.post('/signup', validateSchema(signupSchema, 'body'), signUp);
api.post('/signout', verifyToken(), signOut);

export default api;

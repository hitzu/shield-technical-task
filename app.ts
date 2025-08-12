import { corsHandler } from './src/middlewares/cors-handler';
import { typeCase } from './src/middlewares/type-case';
import Express from 'express';
import authRouter from './src/routes/auth.route';
import walletRouter from './src/routes/wallet.route';
import { errorHandler } from './src/middlewares/error-handler';
import swaggerUI from 'swagger-ui-express';
import { swDocument } from './swagger.def';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';

const app = Express();
app.disable('x-powered-by');
app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json({ limit: '50mb' }));
app.use(corsHandler());
app.use(typeCase('camel'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));
app.use('/api/auth', authRouter);
app.use('/api', walletRouter);
app.use(errorHandler);

module.exports = app;

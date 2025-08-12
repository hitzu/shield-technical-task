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
import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';
import { logger } from './src/services/logger';
import { rateLimitGlobal } from './src/middlewares/rate-limit';

const app = Express();
app.disable('x-powered-by');
app.use(helmet());
app.use(hpp());
app.use(compression());
// Trust proxy for correct IP extraction behind LB/CDN
app.set('trust proxy', true);
// Global rate limiting (disabled in tests inside middleware)
app.use(rateLimitGlobal());
app.use(
  pinoHttp({
    logger,
    genReqId: req => (req.headers['x-request-id'] as string) || randomUUID(),
    customProps: req => ({
      requestId: (req.headers['x-request-id'] as string) || (req as any).id
    }),
    serializers: {
      req(req) {
        return { id: (req as any).id, method: req.method, url: req.url } as any;
      },
      res(res) {
        return { statusCode: res.statusCode } as any;
      }
    },
    autoLogging: {
      ignore: req => req.url?.startsWith('/api-docs') === true
    }
  })
);
// Propagate x-request-id to all responses
app.use((req, res, next) => {
  const requestId =
    (req as any).id || (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('x-request-id', String(requestId));
  next();
});
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json({ limit: '50mb' }));
app.use(corsHandler());
app.use(typeCase('camel'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));
app.use('/api/auth', authRouter);
app.use('/api', walletRouter);
app.use(errorHandler);

module.exports = app;

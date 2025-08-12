import { randomUUID } from 'crypto';

import compression from 'compression';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import pinoHttpMiddleware from 'pino-http';
import swaggerUI from 'swagger-ui-express';

import { corsHandler } from './src/middlewares/cors-handler';
import { errorHandler } from './src/middlewares/error-handler';
import { rateLimitGlobal } from './src/middlewares/rate-limit';
import { typeCase } from './src/middlewares/type-case';
import authRouter from './src/routes/auth.route';
import walletRouter from './src/routes/wallet.route';
import { logger } from './src/services/logger';
import { swDocument } from './swagger.def';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(hpp());
app.use(compression());
// Trust proxy for correct IP extraction behind LB/CDN
app.set('trust proxy', true);
// Global rate limiting (disabled in tests inside middleware)
app.use(rateLimitGlobal());
app.use(
  pinoHttpMiddleware({
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
app.use(urlencoded({ extended: true }));
app.use(json({ limit: '50mb' }));
app.use(corsHandler());
app.use(typeCase('camel'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));
app.use('/api/auth', authRouter);
app.use('/api', walletRouter);
app.use(errorHandler);

export default app;

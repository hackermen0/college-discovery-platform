import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { apiRouter } from './routes';
import { HttpError } from './lib/http-error';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: '1mb' }));

app.use('/api', apiRouter);

app.use((_request, _response, next) => {
  next(new HttpError(404, 'Route not found.'));
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: error.message,
      details: error.details ?? null
    });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: 'Invalid JSON body.' });
    return;
  }

  console.error(error);
  response.status(500).json({ error: 'Internal server error.' });
});

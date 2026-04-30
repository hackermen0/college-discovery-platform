import { Router } from 'express';
import { authRouter } from './auth';
import { collegesRouter } from './colleges';
import { healthRouter } from './health';
import { predictorRouter } from './predictor';
import { questionsRouter } from './questions';
import { savedRouter } from './saved';
import { compareRouter } from './compare';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use('/colleges', collegesRouter);
apiRouter.use('/predictor', predictorRouter);
apiRouter.use('/questions', questionsRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/me', savedRouter);
apiRouter.use('/compare', compareRouter);

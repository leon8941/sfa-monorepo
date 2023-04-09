/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from '../trpc';
import { healthRouter } from './health';
import { userRouter } from './user';

export const appRouter = t.router({
  user: userRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;

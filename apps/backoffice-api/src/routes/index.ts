import { Context } from 'koa';
import Router from 'koa-router';
import { router as apiRouter } from './api';

export const router = new Router<any, Context>();

router.use('/api', apiRouter.routes());

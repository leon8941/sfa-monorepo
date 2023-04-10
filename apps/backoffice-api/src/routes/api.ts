import Router from 'koa-router';

import { AuthInput } from '../types';
import { generateAuthToken } from '../services';
import { prisma } from '@sfa/backoffice-db';
import { accessMiddleware } from '../middlewares/access';

export const router = new Router();

router.post('/authenticate', async (ctx) => {
  const _body: AuthInput = ctx.request.body;
  const validatedInput = AuthInput.parse(_body);

  const user = await prisma.user.findFirst({
    where: {
      usercode: validatedInput.usercode,
      password: validatedInput.password,
    },
  });

  if (!user) {
    ctx.throw(401, 'Incorrect password or user code.');
    return;
  }

  const accessToken = await generateAuthToken({
    id: String(user.id),
    usercode: user.usercode,
  });
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ accessToken });
});

router.get('/something', accessMiddleware, async (ctx) => {
	ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ status: 'ok' });
});
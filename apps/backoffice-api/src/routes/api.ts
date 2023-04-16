import { TokenExpiredError } from 'jsonwebtoken';
import Router from 'koa-router';

import { AuthInput, RefreshTokenInput } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services';
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

  const accessToken = await generateAccessToken({
    id: String(user.id),
  });

  const refreshToken = await generateRefreshToken({
    id: String(user.id),
  });

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ id: String(user.id), accessToken, refreshToken });
});

router.post('/refresh-token',async (ctx) => {
  const _body: RefreshTokenInput = ctx.request.body;
  const { id, refreshToken } = RefreshTokenInput.parse(_body)

  try {
    await verifyRefreshToken(refreshToken);

    const accessToken = await generateAccessToken({
      id
    })

    ctx.set('Content-Type', 'application/json');
    ctx.body = JSON.stringify({ accessToken });
  } catch (exception: unknown) {
    if (exception instanceof TokenExpiredError) {
      ctx.throw(401, JSON.stringify({ error: exception }));
    }

    ctx.throw(401, `Unknown Error: ${exception}`);
  }
})

router.get('/something', accessMiddleware, async (ctx) => {
	ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ status: 'ok' });
});
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import Router from 'koa-router';

import { AuthInput, RefreshTokenInput } from '../types';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAuthToken,
  refreshTokenSecretKey,
} from '../services';
import { prisma } from '@sfa/backoffice-db';
import { validateToken } from '../middlewares/access';

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

  const currentUnixTimeStamp = String(Date.now());

  const accessToken = await generateAccessToken({
    id: String(user.id),
    sessionId: currentUnixTimeStamp,
  });

  const refreshToken = await generateRefreshToken({
    id: String(user.id),
    refreshId: currentUnixTimeStamp,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      sessionId: currentUnixTimeStamp,
      authenticatedAt: new Date(),
      refreshId: currentUnixTimeStamp,
      refreshedAt: new Date(),
    },
  });

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ id: String(user.id), accessToken, refreshToken });
});

router.post('/refresh-token', async (ctx) => {
  const _body: RefreshTokenInput = ctx.request.body;
  const { refreshToken } = RefreshTokenInput.parse(_body);

  try {
    const decoded = await verifyAuthToken(refreshToken, refreshTokenSecretKey);

    if (!decoded.refreshId) {
      const error = new JsonWebTokenError('Refresh token not found!')
      throw error.message;
    }
    
    await prisma.user.findFirstOrThrow({
      where: {
        id: BigInt(decoded.id),
        refreshId: decoded.refreshId,
      },
    });

    const sessionId = String(Date.now());

    const accessToken = await generateAccessToken({
      id: decoded.id,
      sessionId,
    });

    await prisma.user.update({
      where: {
        id: BigInt(decoded.id),
      },
      data: {
        sessionId: sessionId,
        authenticatedAt: new Date(),
      },
    });

    ctx.set('Content-Type', 'application/json');
    ctx.body = JSON.stringify({ accessToken });
  } catch (exception: unknown) {
    if (exception instanceof TokenExpiredError) {
      ctx.throw(401, JSON.stringify({ error: exception }));
    }

    ctx.throw(401, `Unknown Error: ${exception}`);
  }
});

router.post('/logout', validateToken, async (ctx) => {
  const user = ctx.state.user;

  await prisma.user.update({
    where: {
      id: BigInt(user.id),
    },
    data: {
      sessionId: null,
      authenticatedAt: null,
      refreshId: null,
      refreshedAt: null,
    },
  });

  ctx.body = JSON.stringify({ status: 'ok', message: 'logged out' });
});

router.get('/something', validateToken, async (ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({ status: 'ok' });
});

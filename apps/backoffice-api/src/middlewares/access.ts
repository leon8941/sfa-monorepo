import { Context } from 'koa';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '@sfa/backoffice-db';
import { verifyAuthToken, accessTokenSecretKey } from '../services';

export async function validateToken(ctx: Context, next) {
  const { authorization } = ctx.request.headers;
  if (!authorization) {
    ctx.throw(401, 'No authorization provided');
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    ctx.throw(401, 'No token provided');
  }
  try {
    const decoded = await verifyAuthToken(token, accessTokenSecretKey);
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: BigInt(decoded.id),
        sessionId: decoded.sessionId,
      },
    });

    ctx.state.user = user;
    return next();
  } catch (exception: unknown) {
    if (exception instanceof TokenExpiredError) {
      ctx.throw(401, JSON.stringify({ error: exception }));
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      ctx.throw(404, JSON.stringify({ error: exception }));
    }

    ctx.throw(401, `Unknown Error: ${exception}`);
  }
}

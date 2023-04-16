import { Context } from 'koa';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyAccessToken } from '../services';

export async function accessMiddleware(ctx: Context, next) {
  const { authorization } = ctx.request.headers;
  if (!authorization) {
    ctx.throw(401, 'No authorization provided');
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    ctx.throw(401, 'No token provided');
  }
  try {
    const decoded = await verifyAccessToken(token);
    ctx.state.user = decoded;
    return next();
  } catch (exception: unknown) {
    if (exception instanceof TokenExpiredError) {
      ctx.throw(401, JSON.stringify({ error: exception }));
    }

    ctx.throw(401, `Unknown Error: ${exception}`);
  }
}

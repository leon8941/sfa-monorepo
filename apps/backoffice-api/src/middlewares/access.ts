import { verifyAuthToken } from '../services';

export async function accessMiddleware(ctx, next) {
  const { authorization } = ctx.request.headers;
  if (!authorization) {
    ctx.throw(401, 'No authorization provided');
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    ctx.throw(401, 'No token provided');
  }
  try {
    const decoded = await verifyAuthToken(token);
    ctx.state.user = decoded;
    return next();
  } catch (err) {
    ctx.throw(401, 'Invalid token');
  }
}

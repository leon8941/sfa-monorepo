import Koa, { Context, Next } from 'koa';
import Router from 'koa-router';
import { z } from 'zod';

import { prisma } from '@sfa/backoffice-db';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const App = new Koa();
const router = new Router<any, Context>();

const UserSchema = z.object({
  id: z.bigint().nonnegative().transform(val => val.toString()),
  name: z.string().nullish(),
  email: z.string(),
})

type UserSchema = z.infer<typeof UserSchema>;

router.get('/users', async (ctx) => {
  try {
    const _users = await prisma.user.findMany();
    ctx.body = _users.map(user => UserSchema.parse(user));;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 500;
  }
})

App.use(router.routes())

App.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

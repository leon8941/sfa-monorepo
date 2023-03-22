import koa from 'koa';
import { prisma } from '@sfa/backoffice-db';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = new koa();

app.use(async (ctx) => {
  const count = await prisma.user.count();
  ctx.body = { message: `User count ${count}` };
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

import Koa from 'koa';
import { koaBody } from 'koa-body';

import { router } from './routes';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const App = new Koa();

App.use(koaBody());
App.use(router.routes());

App.listen(port, host, () => {
  console.log(`[ready] http://${host}:${port}`);
});

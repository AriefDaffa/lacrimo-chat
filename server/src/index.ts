import 'dotenv/config';
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

import { apiV1 } from './api/v1';

const app = new Elysia()
  .use(swagger())
  .get('/', () => 'Hello World')
  .use(apiV1)
  .listen(process.env.PORT || '5000');

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

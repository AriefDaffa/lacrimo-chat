import { Elysia } from 'elysia';

import { user } from './users/users.controller';
import { chat } from './chat/chat.controller';

export const apiV1 = new Elysia({ prefix: '/v1' }).use(user).use(chat);

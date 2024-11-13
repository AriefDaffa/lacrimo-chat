import { t } from 'elysia';
import { createInsertSchema } from 'drizzle-typebox';

import { Table } from '../../../db/schema';

export const _createUser = createInsertSchema(Table.users);

export const registerBody = t.Omit(_createUser, ['id', 'created_at']);
export const loginUserBody = t.Pick(_createUser, ['email', 'password']);
export const userSearchQuery = t.Object({ q: t.String() });

export type IRegister = typeof registerBody.static;
export type ILoginUser = typeof loginUserBody.static;

export type UserInsertSchema = typeof _createUser.static;

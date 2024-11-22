import { eq, ilike } from 'drizzle-orm';

import { db } from '../../../db/connection';
import { users } from '../../../db/schema';
import { IRegister } from './users.schema';

export const findByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email));
};

export const findByUsername = async (username: string) => {
  return await db
    .select()
    .from(users)
    .where(ilike(users.username, `%${username}%`));
};

export const findUserByID = async (id: number) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)));
};

export const register = async (body: IRegister) => {
  return await db.insert(users).values(body).returning();
};

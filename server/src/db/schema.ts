import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}));

export const chats = pgTable('chats', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  senderId: integer('sender_id').references(() => users.id),
  message: varchar().notNull(),
});

export const chatsRelations = relations(chats, ({ one }) => ({
  sender: one(users, {
    fields: [chats.senderId],
    references: [users.id],
  }),
}));

export const Table = {
  users,
  chats,
  usersRelations,
  chatsRelations,
} as const;

export type Table = typeof Table;

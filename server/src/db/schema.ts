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
  rooms: many(rooms),
}));

export const rooms = pgTable('rooms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  senderOne: integer('sender_one').references(() => users.id),
  senderTwo: integer('sender_two').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  sender: one(users, {
    fields: [rooms.senderOne, rooms.senderTwo],
    references: [users.id, users.id],
  }),
  messages: many(messages),
}));

export const messages = pgTable('messages', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  roomId: integer('room_id').references(() => rooms.id),
  message: varchar().notNull(),
});

export const messageRelations = relations(messages, ({ one }) => ({
  room: one(rooms, {
    fields: [messages.id],
    references: [rooms.id],
  }),
}));

export const Table = {
  users,
  rooms,
  messages,
  usersRelations,
  roomsRelations,
  messageRelations,
} as const;

export type Table = typeof Table;

import { and, asc, desc, eq, isNotNull, not, or, sql } from 'drizzle-orm';

import { db } from '../../../db/connection';
import { messages, rooms, users } from '../../../db/schema';

export const findRoom = async (sender: number, receiver: number) => {
  return await db
    .select()
    .from(rooms)
    .where(
      or(
        and(
          eq(rooms.senderOne, Number(sender)),
          eq(rooms.senderTwo, Number(receiver))
        ),
        and(
          eq(rooms.senderTwo, Number(sender)),
          eq(rooms.senderOne, Number(receiver))
        )
      )
    );
};

export const createRoom = async (sender: number, receiver: number) => {
  return await db
    .insert(rooms)
    .values({
      senderOne: Number(sender),
      senderTwo: Number(receiver),
    })
    .returning();
};

export const insertMessage = async (
  message: string,
  roomID: number,
  sender: number,
  receiver: number
) => {
  return await db.insert(messages).values({
    message: message,
    roomId: roomID,
    sender: sender,
    receiver: receiver,
  });
};

export const findMessage = async (sender: number, receiver: number) => {
  return await db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.sender, sender), eq(messages.receiver, receiver)),
        and(eq(messages.receiver, sender), eq(messages.sender, receiver))
      )
    );
};

export const fetchRoom = async (id: number) => {
  const sq = db
    .select()
    .from(messages)
    .where(
      and(
        isNotNull(messages.receiver),
        or(eq(messages.sender, id), eq(messages.receiver, id))
      )
    )
    .orderBy(desc(messages.createdAt))
    .as('messages');

  return await db
    .selectDistinctOn([users.id])
    .from(users)
    .innerJoin(sq, or(eq(sq.sender, users.id), eq(sq.receiver, users.id)));
};

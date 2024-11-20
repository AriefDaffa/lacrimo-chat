import { and, eq, or, sql } from 'drizzle-orm';

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
  return await db
    .select()
    .from(rooms)
    // .innerJoin(users, eq(rooms.senderOne, users.id)) // Join for senderOne
    // .innerJoin(users.as('userTwo'), eq(rooms.senderTwo, users.as('userTwo').id)) // Join for senderTwo
    .innerJoin(users, eq(rooms.senderOne, users.id)) // Join for senderOne
    .leftJoin(messages, eq(rooms.id, messages.roomId)) // Left join messages to get the latest one
    .where(sql`${rooms.senderOne} = ${id} OR ${rooms.senderTwo} = ${id}`)
    .orderBy(messages.createdAt); // Order by message creation date (desc) to get the latest
  // .groupBy(rooms.id, users.id, 'userTwo.id')
};

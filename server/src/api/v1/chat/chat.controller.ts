import { Elysia, t } from 'elysia';
import { notFound, unauthorized } from '../../../common/utils';
import jwt from '../../../common/jwt';
import { db } from '../../../db/connection';
import { messages, rooms, users } from '../../../db/schema';
import { and, eq, or } from 'drizzle-orm';

export const chat = new Elysia()
  .use(jwt)
  .derive(async ({ headers, jwt, query: { id } }) => {
    const authToken = headers['authorization'];

    if (!authToken || authToken.toString() === '') {
      return unauthorized();
    }

    const splittedToken = authToken.split('Bearer ')[1];

    if (typeof splittedToken !== 'string') {
      return unauthorized();
    }

    const user = await jwt.verify(splittedToken);

    if (!user) {
      return unauthorized();
    }

    // find chat target
    const [findUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)));

    if (!findUser) {
      return notFound();
    }

    // find room, if not found create one
    const [room] = await db
      .select()
      .from(rooms)
      .where(
        or(
          and(
            eq(rooms.senderOne, Number(user.id)),
            eq(rooms.senderTwo, Number(findUser.id))
          ),
          and(
            eq(rooms.senderTwo, Number(user.id)),
            eq(rooms.senderOne, Number(findUser.id))
          )
        )
      );

    console.log('rum', room);

    let roomID = '';

    if (!room) {
      const [createRoom] = await db
        .insert(rooms)
        .values({
          senderOne: Number(user.id),
          senderTwo: Number(findUser.id),
        })
        .returning();

      roomID = String(createRoom.id);
    } else {
      roomID = String(room.id);
    }

    return {
      user: {
        id: user ? user.id : 0,
        username: user ? user.username : '',
        email: user ? user.email : '',
      },
      roomID,
      room,
    };
  })
  .ws('/chat', {
    query: t.Object({
      id: t.String(),
    }),
    open(ws) {
      const roomID = ws.data.roomID;
      ws.subscribe(roomID);
      ws.send(ws.data.room);
    },
    async message(ws, message) {
      const roomID = ws.data.roomID;

      try {
        await db.insert(messages).values({
          message: String(message),
          roomId: Number(roomID),
        });

        ws.publish(roomID, message);
      } catch (error) {
        ws.send(error);
      }
    },
    close(ws) {
      const roomID = ws.data.roomID;
      ws.unsubscribe(roomID);
    },
  });

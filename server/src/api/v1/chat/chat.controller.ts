import { Elysia, t } from 'elysia';

import { notFound, unauthorized } from '../../../common/utils';
import jwt from '../../../common/jwt';
import {
  createRoom,
  findMessage,
  findRoom,
  insertMessage,
} from './chat.service';
import { findUserByID } from '../users/users.service';
import { extractToken } from '../../../utils/extractToken';

export const chat = new Elysia()
  .use(jwt)
  .get(
    '/message',
    async ({ query: { id }, headers, jwt }) => {
      const authToken = headers['authorization'];

      if (!authToken || authToken.toString() === '') {
        return unauthorized();
      }

      const splittedToken = extractToken(authToken);

      const user = await jwt.verify(splittedToken);

      if (!user) {
        return unauthorized();
      }

      const message = await findMessage(Number(user.id), Number(id));

      return {
        success: true,
        message: 'Data fetched!',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          messages: message,
        },
      };
    },
    {
      query: t.Object({
        id: t.String(),
      }),
    }
  )
  .derive(async ({ headers, jwt, query: { id } }) => {
    const authToken = headers['sec-websocket-protocol'];

    if (!authToken || authToken.toString() === '') {
      return unauthorized();
    }

    const user = await jwt.verify(authToken);

    if (!user) {
      return unauthorized();
    }

    // find chat target
    const [findUser] = await findUserByID(Number(id));

    if (!findUser) {
      return notFound();
    }

    const senderID = Number(user.id);
    const receiverID = findUser.id;

    // find room, if not found create one
    const [room] = await findRoom(senderID, receiverID);

    let roomID = '';

    if (!room) {
      const [createdRoom] = await createRoom(senderID, receiverID);

      roomID = String(createdRoom.id);
    } else {
      roomID = String(room.id);
    }

    return {
      senderData: {
        id: user ? user.id : 0,
        username: user ? user.username : '',
        email: user ? user.email : '',
      },
      receiverData: {
        id: findUser ? findUser.id : 0,
        username: findUser ? findUser.username : '',
        email: findUser ? findUser.email : '',
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
      ws.send(ws.data.room || '');
    },
    async message(ws, message) {
      const roomID = Number(ws.data.roomID) || 0;
      const senderID = Number(ws.data.senderData.id) || 0;
      const receiverID = Number(ws.data.receiverData.id) || 0;

      try {
        await insertMessage(String(message), roomID, senderID, receiverID);

        ws.send({
          senderID: senderID,
          message,
          time: new Date(),
        });

        ws.publish(String(roomID), {
          senderID: senderID,
          message,
          time: new Date(),
        });
      } catch (error) {
        ws.send(error);
      }
    },
    close(ws) {
      const roomID = ws.data.roomID;
      ws.unsubscribe(roomID);
    },
  });

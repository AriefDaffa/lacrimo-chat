import { Stream } from '@elysiajs/stream';
import { Elysia, t } from 'elysia';

import { notFound, unauthorized } from '../../../common/utils';
import jwt from '../../../common/jwt';
import {
  createRoom,
  fetchRoom,
  findMessage,
  findRoom,
  insertMessage,
} from './chat.service';
import { findUserByID } from '../users/users.service';
import { db } from '../../../db/connection';
import { messages } from '../../../db/schema';

export const chat = new Elysia()
  .use(jwt)
  // .get(
  //   '/rooms',
  //   ({ cookie: { token }, jwt }) =>
  //     new Stream(async (stream) => {
  //       if (!token || token.toString() === '') {
  //         return unauthorized();
  //       }

  //       const user = await jwt.verify(token.toString());

  //       if (!user) {
  //         return unauthorized();
  //       }
  //       const rooms = await fetchRoom(Number(Number(user.id)));

  //       stream.send({
  //         success: true,
  //         message: 'Data fetched!',
  //         rooms,
  //       });

  //       // const interval = setInterval(async () => {
  //       //   const rooms = await fetchRoom(Number(Number(user.id)));

  //       //   stream.send({
  //       //     success: true,
  //       //     message: 'Data fetched!',
  //       //     rooms,
  //       //   });
  //       // }, 5000);

  //       stream.close();
  //     })
  // )
  .get('/rooms', async ({ cookie: { token }, jwt }) => {
    if (!token || token.toString() === '') {
      return unauthorized();
    }

    const user = await jwt.verify(token.toString());

    if (!user) {
      return unauthorized();
    }

    const rooms = await fetchRoom(Number(user.id));

    return {
      success: true,
      message: 'Data fetched!',
      rooms,
    };
  })
  .get(
    '/message',
    async ({ query: { id }, jwt, cookie: { token } }) => {
      if (!token || token.toString() === '') {
        return unauthorized();
      }

      const user = await jwt.verify(token.toString());

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
      cookie: t.Cookie({ token: t.String() }),
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

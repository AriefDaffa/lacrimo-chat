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
  .get('/rooms', async ({ cookie: { token }, jwt }) => {
    if (!token || token.toString() === '') {
      return unauthorized();
    }

    const user = await jwt.verify(token.toString());

    if (!user) {
      return unauthorized();
    }

    const rooms = await fetchRoom(Number(user.id));

    rooms.sort((a, b) => {
      const dateA = new Date(a?.messages?.createdAt).getTime();
      const dateB = new Date(b?.messages?.createdAt).getTime();
      return dateA - dateB;
    });

    const uniqueUsers = new Set();
    const filteredRooms = rooms.filter((room) => {
      if (uniqueUsers.has(room?.users?.id)) {
        return false;
      }
      uniqueUsers.add(room?.users?.id);
      return true;
    });

    // const getUniqueUsersWithRooms = (data) => {
    //   const uniqueUsers = {};
    //   const updatedRooms = [];

    //   data.forEach((entry) => {
    //     const user = entry.users;

    //     if (!uniqueUsers[user.id]) {
    //       uniqueUsers[user.id] = user;
    //       updatedRooms.push(entry);
    //     }
    //   });

    //   return updatedRooms;
    // };

    return {
      success: true,
      message: 'Data fetched!',
      rooms: rooms
        .sort((a, b) => {
          const dateA = new Date(a.messages.createdAt).getTime();
          const dateB = new Date(b.messages.createdAt).getTime();
          return dateA - dateB;
        })
        .reduce((acc: any[], room) => {
          if (!acc.some((existing) => existing.users.id === room?.users?.id)) {
            acc.push({
              messages: {
                id: room.messages.id,
                roomId: room.messages.roomId,
                sender: room.messages.sender,
                receiver: room.messages.receiver,
                message: room.messages.message,
                createdAt: room.messages.createdAt,
              },
              users: {
                id: room?.users?.id,
                username: room?.users?.username,
                email: room?.users?.email,
              },
            });
          }
          return acc;
        }, []),
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
  .derive(async ({ jwt, query: { id }, cookie: { token } }) => {
    if (!token || token.toString() === '') {
      return unauthorized();
    }

    const user = await jwt.verify(token.toString());

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

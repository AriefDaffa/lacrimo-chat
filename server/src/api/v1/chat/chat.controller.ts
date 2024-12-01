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

    return {
      success: true,
      message: 'Data fetched!',
      data: rooms,
    };
  })
  .get(
    '/rooms/stream',
    ({ cookie: { token }, jwt }) =>
      new Stream(async (stream) => {
        if (!token || token.toString() === '') {
          return unauthorized();
        }

        const user = await jwt.verify(token.toString());

        if (!user) {
          return unauthorized();
        }

        setInterval(async () => {
          const rooms = await fetchRoom(Number(user.id));

          rooms.sort((a, b) => {
            const dateA = new Date(a?.messages?.createdAt).getTime();
            const dateB = new Date(b?.messages?.createdAt).getTime();
            return dateA - dateB;
          });

          stream.send({
            success: true,
            message: 'Data fetched!',
            rooms: rooms
              .sort((a, b) => {
                const dateA = new Date(a.messages.createdAt).getTime();
                const dateB = new Date(b.messages.createdAt).getTime();
                return dateA - dateB;
              })
              .reduce((acc: any[], room) => {
                if (
                  !acc.some((existing) => existing.users.id === room?.users?.id)
                ) {
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
          });
        }, 5000);
      })
  )
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
  .derive(async ({ jwt, cookie: { token }, query: { receiverId } }) => {
    if (!token || token.toString() === '') {
      return unauthorized();
    }

    const user = await jwt.verify(token.toString());

    if (!user) {
      return unauthorized();
    }

    return {
      senderData: {
        id: user ? user.id : 0,
        username: user ? user.username : '',
        email: user ? user.email : '',
      },
      receiverId,
    };
  })
  .ws('chat/list', {
    async open(ws) {
      const receiverId = ws.data.receiverId;

      let params = 0;

      console.log(ws.data.senderData.id);
      console.log(receiverId);

      try {
        params = Number(ws.data.senderData.id) || 0;
        const rooms = await fetchRoom(params);

        ws.subscribe(`user-${ws.data.senderData.id}`);

        ws.send({
          success: true,
          message: 'Data fetched!',
          data: rooms.sort((a, b) => {
            return b.messages.id - a.messages.id;
          }),
        });

        if (receiverId) {
          ws.unsubscribe(`user-${ws.data.senderData.id}`);
          ws.subscribe(`user-${receiverId}`);

          params = Number(receiverId) || 0;

          ws.send({
            success: true,
            message: 'Data fetched!',
            data: rooms.sort((a, b) => {
              return b.messages.id - a.messages.id;
            }),
          });
        }
      } catch (error) {
        ws.send(error);
      }
    },
    async message(ws, message) {
      const receiverId = ws.data.receiverId;

      let params = 0;

      if (!receiverId) {
        params = Number(ws.data.senderData.id) || 0;
      } else {
        params = Number(receiverId) || 0;
      }

      try {
        params = Number(ws.data.senderData.id) || 0;
        const rooms = await fetchRoom(params);

        ws.subscribe(`user-${ws.data.senderData.id}`);

        ws.send({
          success: true,
          message: 'Data fetched!',
          data: rooms.sort((a, b) => {
            return b.messages.id - a.messages.id;
          }),
        });

        if (receiverId) {
          ws.unsubscribe(`user-${ws.data.senderData.id}`);
          ws.subscribe(`user-${receiverId}`);

          params = Number(receiverId) || 0;

          ws.send({
            success: true,
            message: 'Data fetched!',
            data: rooms.sort((a, b) => {
              return b.messages.id - a.messages.id;
            }),
          });
        }
      } catch (error) {
        ws.send(error);
      }
    },
    close(ws) {
      const receiverId = ws.data.receiverId;

      if (!receiverId) {
        ws.unsubscribe(`user-${ws.data.senderData.id}`);
      } else {
        ws.unsubscribe(`user-${receiverId}`);
      }
    },
  })
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
    open(ws) {
      const roomID = ws.data?.roomID;
      ws.subscribe(roomID);
      ws.send(ws.data?.room || '');
    },
    async message(ws, message) {
      const roomID = Number(ws.data?.roomID) || 0;
      const senderID = Number(ws.data?.senderData.id) || 0;
      const receiverID = Number(ws.data?.receiverData.id) || 0;

      ws.subscribe(ws.data.roomID);

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

        ws.subscribe(`user-${ws.data.receiverData.id}`);
        ws.publish(`user-${ws.data.receiverData.id}`, {
          success: 'true',
          message: 'Message sent!',
          data: [
            {
              users: {
                id: ws.data.senderData.id,
                username: ws.data.senderData.username,
                email: ws.data.senderData.email,
              },
              messages: {
                message,
              },
            },
          ],
        });
        ws.unsubscribe(`user-${ws.data.receiverData.id}`);
      } catch (error) {
        ws.send(error);
      }
    },
    close(ws) {
      const roomID = ws.data?.roomID;
      ws.unsubscribe(roomID);
    },
  });

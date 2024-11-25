import { Elysia } from 'elysia';
import { notFound, unauthorized } from './utils';
import { findUserByID } from '../api/v1/users/users.service';
import { createRoom, findRoom } from '../api/v1/chat/chat.service';
import jwt from './jwt';

export const chatMiddleware = new Elysia()
  .use(jwt)
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
  });

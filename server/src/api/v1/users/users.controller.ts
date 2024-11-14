import { Elysia } from 'elysia';

import {
  _createUser,
  loginUserBody,
  registerBody,
  userSearchQuery,
} from './users.schema';
import { findByEmail, findByUsername, register } from './users.service';
import {
  badRequest,
  internalError,
  notFound,
  unauthorized,
  unprocessable,
} from '../../../common/utils';
import jwt from '../../../common/jwt';
import { validateToken } from '../../../common/auth';

export const user = new Elysia({ prefix: '/user' })
  .use(jwt)
  .post(
    '/register',
    async ({ body: { email, password, username } }) => {
      if (
        password.length < 8 ||
        password === '' ||
        email === '' ||
        username === ''
      ) {
        return badRequest();
      }

      const findEmail = await findByEmail(email);

      if (findEmail.length > 0) {
        return unprocessable('Email already registered');
      }

      password = await Bun.password.hash(password);

      const registerUser = await register({ email, password, username });

      if (registerUser.length > 0) {
        return {
          success: true,
          message: 'User created!',
          data: {
            username: registerUser[0].username,
            email: registerUser[0].email,
          },
        };
      }

      return internalError();
    },
    { body: registerBody }
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      const findUser = await findByEmail(body.email);

      if (findUser.length == 0) {
        return unauthorized();
      }

      const isMatch = await Bun.password.verify(
        body.password,
        findUser[0].password
      );

      if (!isMatch) {
        return unauthorized();
      }

      const token = await jwt.sign({
        id: findUser[0].id,
        username: findUser[0].username,
        email: findUser[0].email,
      });

      return {
        success: true,
        message: 'User created!',
        data: {
          username: findUser[0].username,
          email: findUser[0].email,
          token,
        },
      };
    },
    { body: loginUserBody }
  )
  .get(
    '/search',
    async ({ query: { q }, jwt, headers: { authorization } }) => {
      const tok = validateToken(authorization || '');

      if (typeof tok === 'string') {
        const user = await jwt.verify(tok);

        if (!user) {
          return unauthorized();
        }

        const find = await findByUsername(q);

        if (!find.length) {
          return notFound('User not found');
        }

        return {
          success: true,
          message: 'User found!',
          data: {
            id: find[0].id,
            username: find[0].username,
            email: find[0].email,
          },
        };
      }

      return tok;
    },
    {
      query: userSearchQuery,
    }
  );

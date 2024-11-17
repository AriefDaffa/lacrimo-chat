import { Elysia, t } from 'elysia';

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
import { cookie } from '@elysiajs/cookie';

export const user = new Elysia({ prefix: '/user' })
  .use(jwt)
  .use(cookie())
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
    async ({ body, jwt, cookie: { token } }) => {
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

      const tok = await jwt.sign({
        id: findUser[0].id,
        username: findUser[0].username,
        email: findUser[0].email,
      });

      token.maxAge = 86400;
      // token.secure = true;
      // token.httpOnly = true;
      token.value = tok;
      // token.sameSite = 'none';
      // token.domain = 'localhost:3001';

      return {
        success: true,
        message: 'User created!',
        data: {
          username: findUser[0].username,
          email: findUser[0].email,
          token: tok,
        },
      };
    },
    {
      body: loginUserBody,
      // cookie: t.Cookie({
      //   token: t.String(),
      // }),
    }
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

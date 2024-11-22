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
        return badRequest('Invalid credentials');
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
      // token.httpOnly = true;
      token.value = tok;

      return {
        success: true,
        message: 'Login success!',
        data: {
          username: findUser[0].username,
          email: findUser[0].email,
          token: tok,
        },
      };
    },
    { body: loginUserBody }
  )
  .get(
    '/search',
    async ({ query: { q }, jwt, cookie: { token } }) => {
      if (!token || token.toString() === '') {
        return unauthorized();
      }

      const verifyTok = await jwt.verify(token.toString());

      if (!verifyTok) {
        return unauthorized();
      }

      const find = await findByUsername(q);

      if (!find.length) {
        return notFound('User not found');
      }

      return {
        success: true,
        message: 'User found!',
        data: find?.map((item) => {
          return {
            id: item.id,
            username: item.username,
            email: item.email,
          };
        }),
      };
    },
    { query: userSearchQuery }
  )
  .get(
    '/current',
    async ({ cookie: { token }, jwt }) => {
      if (!token || token.toString() === '') {
        return unauthorized();
      }
      const user = await jwt.verify(token.toString());

      if (!user) {
        return unauthorized();
      }

      return user;
    },
    { cookie: t.Cookie({ token: t.String() }) }
  );

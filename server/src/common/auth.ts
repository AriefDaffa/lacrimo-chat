import { Elysia } from 'elysia';
import { unauthorized } from './utils';

export const validateToken = (token: string) => {
  if (!token || token.toString() === '') {
    return unauthorized();
  }

  const splitToken = token.split('Bearer ')[1];

  if (typeof splitToken !== 'string') {
    return unauthorized();
  }

  return splitToken;
};

// export const authMiddleware = new Elysia().derive()

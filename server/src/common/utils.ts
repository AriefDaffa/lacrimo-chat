import { error } from 'elysia';

export const badRequest = (cause?: any) => {
  return error(400, {
    success: false,
    message: cause ? `${cause}` : 'Bad Request',
    data: null,
  });
};

export const unauthorized = (cause?: any) => {
  return error(401, {
    success: false,
    message: cause ? `${cause}` : 'Invalid credentials',
    data: null,
  });
};

export const unprocessable = (cause?: any) => {
  return error(422, {
    success: false,
    message: cause ? `${cause}` : 'Validation failed, check parameters',
    data: null,
  });
};

export const internalError = (cause?: any) => {
  return error(500, {
    success: false,
    message: cause ? `${cause}` : 'Internal server error',
    data: null,
  });
};

export const notFound = (cause?: any) => {
  return error(404, {
    success: false,
    message: cause ? `${cause}` : 'Invalid resource identifier',
    data: null,
  });
};

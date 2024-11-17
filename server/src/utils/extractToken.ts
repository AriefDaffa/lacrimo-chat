export const extractToken = (token: string) => {
  return token.split('Bearer ')[1] || '';
};

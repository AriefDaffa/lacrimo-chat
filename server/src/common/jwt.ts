import elysisaJwt from '@elysiajs/jwt';

const jwt = elysisaJwt({
  name: 'jwt',
  secret: Bun.env.JWT_SECRET || 'Sorasaki Hina',
  exp: '7d',
});

export default jwt;

export type JwtContext = Pick<typeof jwt.decorator, 'jwt'>;

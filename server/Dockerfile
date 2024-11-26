FROM oven/bun

WORKDIR /app

COPY ./server/package.json .
COPY ./server/bun.lockb .
COPY ./server/drizzle.config.ts .
COPY ./server/run.sh .

RUN bun install drizzle-kit
RUN bun install --production

COPY ./server/src src
COPY ./server/tsconfig.json .
COPY ./server/.env .
# COPY public public

RUN chmod +x /app/run.sh

ENV NODE_ENV production
# CMD ["./run.sh"]
CMD [ "bun", "dev" ]

EXPOSE 3000
import { Elysia, t } from 'elysia';

export const chat = new Elysia().ws('/chat', {
  query: t.Object({
    id: t.String(),
  }),
  open(ws) {},
  message(ws, message) {
    // Get schema from `ws.data`
    const { id } = ws.data.query;

    ws.send({
      id,
      message,
      time: Date.now(),
    });
  },
});

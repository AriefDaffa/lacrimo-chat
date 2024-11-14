import { Elysia, t } from 'elysia';
import { unauthorized } from '../../../common/utils';

export const chat = new Elysia().ws('/chat', {
  query: t.Object({
    id: t.String(),
  }),
  open(ws) {
    const welcomeMsg = `Joined Room ${ws.data.query.id}`;

    ws.subscribe(ws.data.query.id);
    ws.send(welcomeMsg);
  },
  message(ws, message) {
    ws.publish(ws.data.query.id, message);
    // Get schema from `ws.data`
    // const { id } = ws.data.query;
    // ws.send({
    //   id,
    //   message,
    //   time: Date.now(),
    // });
  },
  close(ws) {
    ws.unsubscribe(ws.data.query.id);
  },
});

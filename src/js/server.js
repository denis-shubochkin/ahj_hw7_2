/* eslint-disable no-param-reassign */

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');


const app = new Koa();

app.use(koaBody({
  urlencoded: true,
}));


const tickets = [];
// tickets[0] = {
//   id: 1,
//   name: 'test',
//   status: true,
//   created: now,
// };
// tickets[1] = {
//   id: 2,
//   name: 'test2',
//   status: true,
//   created: now,
// };
const ticketsFull = [];
// ticketsFull[0] = {
//   id: 1,
//   name: 'test',
//   status: true,
//   created: 1,
//   description: 'desc',
// };
// ticketsFull[1] = {
//   id: 2,
//   name: 'test2',
//   status: true,
//   created: 2,
//   description: 'desc',
// };


app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  });
  const { method } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      await next();
      return;
    case 'ticketById':
      ctx.response.body = ticketsFull.find((el) => {
        if (el.id === Number(ctx.request.query.id)) return el;
        return false;
      });
      console.log(ctx.response.body);
      await next();
      return;
    case 'patchTicket':
      tickets.forEach((el) => {
        if (el.id === Number(ctx.request.query.id)) {
          el.name = ctx.request.query.name;
        }
      });
      ticketsFull.forEach((el) => {
        if (el.id === Number(ctx.request.query.id)) {
          el.name = ctx.request.query.name;
          el.description = ctx.request.query.description;
        }
      });
      ctx.response.body = `Тикет ${ctx.request.query.id} изменен`;
      await next();
      return;
    case 'delTicket':
      tickets.forEach((el, index) => {
        if (el.id === Number(ctx.request.query.id)) {
          tickets.splice(index, 1);
        }
      });
      ticketsFull.forEach((el, index) => {
        if (el.id === Number(ctx.request.query.id)) {
          ticketsFull.splice(index, 1);
        }
      });
      ctx.response.body = `Тикет ${ctx.request.query.id} удален`;
      await next();
      return;
    case 'createTicket':
      tickets.push({
        id: Number(ctx.request.query.id),
        name: ctx.request.query.name,
        status: ctx.request.query.status,
        created: ctx.request.query.created,
      });
      ticketsFull.push({
        id: Number(ctx.request.query.id),
        name: ctx.request.query.name,
        status: ctx.request.query.status,
        created: ctx.request.query.created,
        description: ctx.request.query.description,
      });
      ctx.response.body = tickets[tickets.length - 1];
      await next();
      return;
    default:
      ctx.response.body = 'error';
      ctx.response.status = 404;
  }
});

// eslint-disable-next-line no-unused-vars
const port = process.env.PORT || 7070;
// eslint-disable-next-line no-unused-vars
const server = http.createServer(app.callback()).listen(port);

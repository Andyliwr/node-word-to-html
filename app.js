const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const body = require('koa-body');
const logger = require('koa-logger');

const index = require('./routes/index');

// error handler
onerror(app);

// middlewares
app.use(
  body({
    multipart: true,
    urlencoded: true,
    limit: '10mb',
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;

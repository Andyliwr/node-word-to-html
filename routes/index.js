const router = require('koa-router')();
const mammoth = require('mammoth');
const qn = require('qn');
const uuid = require('uuid');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: '主页'
  });
});

router.get('/editor', async (ctx, next) => {
  await ctx.render('editor', {
    title: '编辑HTML'
  });
});

const client = qn.create({
  accessKey: 'pz1XaE-7IPSWuJjLTrjH3Rv9O5v0hj510O1ttMm6',
  secretKey: 'HB_zxxzxJ3YpKFAD3PC7egJvgx4yOp3t6Fg7xdYP',
  bucket: 'upload',
  origin: 'https://fs.andylistudio.com'
});

router.post('/word-to-html', async (ctx, next) => {
  let title = ctx.request.body.title;
  let path = ctx.request.files.file.path;
  if (path) {
    return new Promise(async (resolve, reject) => {
      mammoth
        .convertToHtml({ path })
        .then(async result => {
          ctx.body = { code: 0, title: title, html: `<div class="container">${result.value}</div>` };
          resolve(true);
        })
        .done();
    });
  } else {
    ctx.body = { code: -1, body: 'path不存在' };
  }
});

router.post('/generate-link', async (ctx, next) => {
  let html = ctx.request.body.html;
  let title = ctx.request.body.title;
  if (html) {
    return new Promise(async (resolve, reject) => {
      let tmp = `
      <!DOCTYPE html>
      <html lang="zh">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="viewport-fit=cover,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no,width=device-width">
          <meta name="format-detection" content="telephone=no">
          <meta name="apple-touch-fullscreen" content="YES">
          <meta name="apple-mobile-web-app-capable" content="yes">
          <script src="//s.thsi.cn/js/m/kh/insurance2_0/scripts/autoFontSize.min.js"></script>
          <link rel="stylesheet" href="//s.thsi.cn/js/m/kh/insurance2_0/products/styles/article.min.css?20180504">
          <title>${title}</title>
        </head>
        <body>
          <div class="container">${html}</div>
        </body>
      </html>`;

      // 上传为文件到七牛云;
      client.upload(tmp, { key: `/word2html/${uuid.v1()}.html` }, function(err, result) {
        ctx.body = { code: 0, url: result.url };
        resolve(true);
      });
    });
  } else {
    ctx.body = { code: -1, body: '内容为空' };
  }
});

module.exports = router;

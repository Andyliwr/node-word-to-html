let title = sessionStorage.getItem('title');
if (title) {
  document.title = title;
}

KindEditor.ready(function(K) {
  window.editor = K.create('#editor', {
    height: '667px'
  });
  K.html('#editor', sessionStorage.getItem('html') || '');
});

$(document).ready(function() {
  $('#upload-btn').click(function() {
    $.ajax({
      url: '/generate-link',
      type: 'POST',
      data: { html: window.editor.html(), title: title || '未知文章' },
      success: function(data) {
        if (data.code == 0) {
          $('.link')
            .show()
            .find('a')
            .html(data.url)
            .attr('href', data.url);
        } else {
          alert('生成链接失败' + (data.msg ? '，' + data.msg : ''));
        }
      },
      error: function(error) {
        console.warn(error);
        alert('生成链接失败');
      }
    });
  });
  $('#export-btn').click(function() {
    const htmlName = sessionStorage.getItem('htmlName') || 'word2html';
    downloadF(window.editor.html(), `${htmlName}.html`);
  })
});

let downloadF = function (content, filename) {
  // 创建a标签
  let linkNode = document.createElement('a');
  linkNode.download = filename;
  linkNode.style.display = 'none';
  // 利用Blob对象将字符内容转变成二进制数据
  let blob = new Blob([mixtureHtml(content)]);

  linkNode.href = URL.createObjectURL(blob);
  // 点击
  document.body.appendChild(linkNode);
  linkNode.click();
  // 移除
  document.body.removeChild(linkNode);
};

let mixtureHtml = function (content) {
  const title = sessionStorage.getItem('title') || 'word转化html';
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        padding: 20px;
        font: 14px 'Lucida Grande', Helvetica, Arial, sans-serif;
      }
    </style>
  </head>
  <body>
  ` + content +
  `
  </body>
  </html>
  `;
  return html;
}

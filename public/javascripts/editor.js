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
});

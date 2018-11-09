var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

// server から受信
socket.on('newMessage', function (message) {
  console.log('newMessage', message);

  //パラグラフ作成
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  // HTML のid messages　に li 追加される
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  // 
  socket.emit('createMessage', {
    from: 'User',
    // message に入力された文字
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  //console.log($.parseQuery(window.location.href));
  var params = $.deparam.querystring(window.location.search);

  //params.newroom = params.room[0].place + params.room[1];
  params.nroom = params.man + params.woman;

  console.log("params:",params);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('setName', function (gender, setN , num) {

  jQuery('#char-box').html(setN);

  var name = '';
  //　男

  if( gender === '1') {
    name = 'girl' + num + '.png';
  }
  else{
    name = 'boy' + num + '.png';
  }
  console.log(name);
  var template = jQuery('#charImage-template').html();
  var html = Mustache.render(template, {
    fName: name,
  });
  console.log(html,"+gender",gender);
  jQuery('#i-png').html(html);

  //scrollToBottom();
});

socket.on('updateName', function (name,room, id) {
  // var ol = jQuery('<ol></ol>');

  // users.forEach(function (user) {
  //   ol.append(jQuery('<li></li>').text(user));
  // });
    jQuery('#sentName').html(name);
    socket.emit('updateMyName', socket.id);

});

socket.on('updateName2', function (name) {
  // var ol = jQuery('<ol></ol>');

  // users.forEach(function (user) {
  //   ol.append(jQuery('<li></li>').text(user));
  // });
    jQuery('#sentName').html(name);

});

socket.on('newMessage', function (message) {
  console.log("message=",message.text);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
  });

  jQuery('#message-box').html(html);
  console.log(html);
  //scrollToBottom();
});

socket.on('newLog', function (message) {
  console.log("message=",message.text);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#log-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    createdAt: formattedTime
  });

  jQuery('#logTemplate').append(html);
});

socket.on('newYourImage', function (image) {
  var formattedTime = moment(image.createdAt).format('h:mm a');
  var template = jQuery('#image-template').html();
  var html = Mustache.render(template, {
    fName: image.fName,
  });
  console.log("yourImage");
  $(`#your-photos`).html(html);

  //
  // jQuery('#messages').append(html);
  // scrollToBottom();
});

socket.on('sentImage', function (image) {
  console.log("ok");
  alert("新しい写真が送られてきたよ！");
  var formattedTime = moment(image.createdAt).format('h:mm a');
  var template = jQuery('#image-template').html();
  var html = Mustache.render(template, {
    fName: image.fName,
    //createdAt: formattedTime
  });
  $(`#oppnent-photo`).html(html);
  //
  // jQuery('#messages').append(html);
  // scrollToBottom();
});

socket.on('newEvaluation', function (message) {
  console.log("ok");
  alert("相手から評価が送られてきたよ！");
  var num = parseInt(message.text);
  var count = 0;
  var template = $('#star-template').html();

  while( count < num) {
    console.log(count);
    if(count === 0) {
      $(`#star-area`).html(template);
      count++;
      continue;
    }
    $(`#star-area`).append(template);
    count++;
  }
  //var formattedTime = moment(image.createdAt).format('h:mm a');


  console.log(message.text);
  console.log(typeof(message.text));
  //$(`#oppnent-photo`).html(html);
  //
  // jQuery('#messages').append(html);
  // scrollToBottom();
});

// form id
jQuery('#message-area').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');
  console.log(messageTextbox.val());
  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });

  socket.emit('createLog', {
    text: messageTextbox.val(),
  }, function () {
  });

});

// form id
jQuery('#number-form').on('submit', function (e) {
  e.preventDefault();

  var numberData = jQuery('[name=radio]:checked').val();
  console.log(numberData);
  socket.emit('createStar', {
    number: numberData
  }, function () {
    //numberData.val('')
  });
});

// form id
jQuery('#image-form').on('submit', function (e) {
  e.preventDefault();

  var imageData = jQuery('[name=image]');

  console.log(imageData[0].files[0]);
  console.log(imageData[0].files[0].name);

  socket.emit('createImage', {
    buffer: imageData[0].files[0],
    fName: imageData[0].files[0].name
  }, function () {

  });
});

// button id
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});

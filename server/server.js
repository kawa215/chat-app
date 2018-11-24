const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');

const {generateImage, generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// ユーザーはpublicへ
app.use(express.static(publicPath));
app.use('/images', express.static(__dirname + '../public/images'));
//コネクション確立
io.on('connection', (socket) => {
  console.log('New user connected');

  //　ユーザー参加した時
  socket.on('join', (params, callback) => {

    // 文字列が空の場合
    if (users.getUserList(params.nroom).length >= 2) {
      return callback('すでに部屋が一杯です!他のタイプを選んでください!!');
    }

    if(users.getUserList(params.nroom).length === 1){
      var user = users.getUser_room(params.nroom);
      if(params.gender === user.gender) {
        return callback('すでに部屋が一杯です!他のタイプを選んでください!!');
      }
    }
    // 特定の部屋に
    socket.join(params.nroom);

    users.removeUser(socket.id);
    // ユーザーの追加
    users.addUser(socket.id, params.name, params.nroom, params.gender ,params.man , params.woman);

    //キャラ名設定
    var setN  = '';
    var num = 0;
    console.log(params.gender);
    if( params.gender === '1' ){
      var type = params.woman;
      switch (type) {
        case '1':
          setN = 'メイ';
          num = 1;
          break;
        case '2':
          setN = 'イオリ';
          num = 2;
          break;
        case '3':
          setN = 'ジュリ';
          num = 3;
          break;
        case '4':
          setN = 'ヨウコ';
          num = 4;
          break;
        case '5':
          setN = 'リナ';
          num = 5;
          break;
        default:
          console.log('失敗');
      }
    } else {
      var type = params.man;
      switch (type) {
        case '1':
          setN = 'イツキ';
          num = 1;
          break;
        case '2':
          setN = 'メグム';
          num = 2;
          break;
        case '3':
          setN = 'ジュン';
          num = 3;
          break;
        case '4':
          setN = 'ヨウイチ';
          num = 4;
          break;
        case '5':
          setN = 'ウミ';
          num = 5;
          break;
        default:
          console.log('失敗');
      }
    }
    console.log("gender=",params.gender);
    socket.emit('setName', params.gender, setN, num);
    // console.log(users.getUserList(params.nroom));

    // キャラクターの名前変更
    // 接続されたユーザーへ送信

    if(users.getUserList(params.nroom).length === 1) {
      socket.emit('newMessage', generateMessage('f/m app にようこそ ! 通信相手を待っています....。'));
    }
    else {
      socket.emit('newMessage', generateMessage('f/m app にようこそ !　服の写真、もしくはメッセージを送ってみましょう！'));

      socket.broadcast.to(params.nroom).emit('updateName', params.name , params.nroom,socket.id);
    }

    // 全員に送信
    socket.broadcast.to(params.nroom).emit('newMessage', generateMessage(`${params.name}さんが参加しました. 服の写真、もしくはメッセージを送ってみましょう！`));

    //callback実行
    callback();
  });

  socket.on('updateMyName', (id) => {
      // 特定のユーザーを取り出す
    var user = users.getUser(id);
    console.log(user);

      //  文字列の場合
    if (user) {
      // 主だけ
      socket.broadcast.to(user.room).emit('updateName2', user.name);
      console.log("送信");
    }
  });

  socket.on('createImage', (image, callback) => {
      // 特定のユーザーを取り出す
    var user = users.getUser(socket.id);
    console.log(user);
    fs.writeFileSync(`./public/images/uploads/${image.fName}`,new Buffer(image.buffer),'binary');
      //  文字列の場合
    if (user) {
      // 主だけ
      socket.emit('newYourImage', generateImage(image.fName));
      // 相手に送信
      console.log(users.getUserList(user.room));
      socket.broadcast.to(user.room).emit('sentImage', generateImage(image.fName));
      console.log("送信");
    }
    // callback 何もしない

    callback();
  });

  socket.on('createLog', (message, callback) => {
      // 特定のユーザーを取り出す
      var user = users.getUser(socket.id);

      //  文字列の場合
      if (user && isRealString(message.text)) {
        socket.emit('newLog', generateMessage(message.text));
      }
    // callback 実行 テキストボックスを空にする
      callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log("welcome createMessage");
    // 特定のユーザーを取り出す
    var user = users.getUser(socket.id);
    console.log(user);
    //  文字列の場合
    if (user && isRealString(message.text)) {
      // ルームに送信
      // console.log(user.room);
      // console.log(users.getUserList(user.room));
      socket.broadcast.to(user.room).emit('newMessage', generateMessage(message.text));
      //socket.broadcast.to(params.nroom).emit('newMessage', generateMessage(`${params.name} さんが　参加されました!`));
      console.log("sent newMessage");
    }
  // callback 実行 テキストボックスを空にする
    callback();
  });

  socket.on('createStar', (message, callback) => {
    // console.log("welcome createMessage");
    // 特定のユーザーを取り出す
    var user = users.getUser(socket.id);
    // console.log(user);
    //  文字列の場合
    if (user && isRealString(message.number)) {
      // ルームに送信
      // console.log(user.room);
      // console.log(users.getUserList(user.room));
      console.log("ok");
      socket.broadcast.to(user.room).emit('newEvaluation', generateMessage(message.number));
      //socket.broadcast.to(params.nroom).emit('newMessage', generateMessage(`${params.name} さんが　参加されました!`));
      // console.log("sent newMessage");
    }
  // callback 実行 テキストボックスを空にする
    callback();
  });

  // socket.on('createLocationMessage', (coords) => {
  //   var user = users.getUser(socket.id);
  //
  //   if (user) {
  //     io.to(user.nroom).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  //   }
  // });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      socket.broadcast.to(user.room).emit('updateUserList', users.getUserList(user.room));
      socket.broadcast.to(user.room).emit('newMessage', generateMessage(`${user.name}さんが退出されました.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

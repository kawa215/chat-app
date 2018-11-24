[{
  id: '/#12poiajdspfoif',
  name: 'Andrew',
  room: 'The Office Fans'
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor () {
    this.users = [];
  }
  //配列追加
  addUser (id, name ,room , gender, man , women) {
    var user = {id, name, room, gender,  man, women};
    this.users.push(user);
    return user;
  }
  //
  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  //　指定したidを取り出す 配列型で
  getUser (id) {
    return this.users.filter((user) => user.id === id)[0]
  }

  getUser_room (room) {
    return this.users.filter((user) => user.room === room)[0]
  }
  //

  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};

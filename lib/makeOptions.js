module.exports = function makeOptions (object) {
  let string = 'mongodb://'
  if (object.username && object.password) {
    string += object.username + ':' + object.password + '@'
  }
  string += object.host + ':' + object.port + '/' + object.db
  return string
}

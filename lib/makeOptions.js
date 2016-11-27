module.exports = function makeOptions (object) {
  let string = 'mongodb://'
  if (object.user && object.pass) {
    string += object.user + ':' + object.pass + '@'
  }
  string += object.host + ':' + object.port + '/' + object.db
  return string
}

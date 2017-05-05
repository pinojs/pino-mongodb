'use strict'

module.exports = function makeUrl (program) {
  var url = 'mongodb://'

  if (program.username && program.password) {
    url += program.username + ':' + program.password + '@'
  }

  url += program.host + ':' + program.port + '/' + program.db

  return url
}

'use strict'

module.exports = function makeUrl (program) {
  if (program.url) return program.url

  var url = 'mongodb://'
  if (program.host.slice(0, 10) === url) {
    program.host = program.host.slice(10)
  }

  if (program.username && program.password) {
    url += program.username + ':' + program.password + '@'
  }

  url += program.host + ':' + program.port + '/' + program.db

  return url
}

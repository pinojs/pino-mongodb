'use strict'

module.exports = function makeLog (data) {
  var log

  try {
    log = JSON.parse(data)
  } catch (e) {
    log = {
      msg: data
    }
  }

  return log
}

'use strict'

module.exports = function makeLog (data) {
  let log

  try {
    log = JSON.parse(data)
  } catch (e) {
    log = {
      msg: data
    }
  }

  return log
}

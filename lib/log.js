'use strict'

module.exports = function log (data) {
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

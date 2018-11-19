'use strict'

module.exports = function log (data) {
  let log

  try {
    log = JSON.parse(data)
    if (log.time) log.time = new Date(log.time)
  } catch (e) {
    log = {
      msg: data
    }
  }

  return log
}

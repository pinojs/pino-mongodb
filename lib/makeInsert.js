'use strict'

const { nextTick } = require('node:process')
const { EOL } = require('node:os')
const options = {
  forceServerObjectId: true
}

module.exports = function makeInsert (showErrors, showStdout) {
  let callback

  if (showErrors && showStdout) {
    callback = function (e, log) {
      if (e) {
        console.error(e)
      } else {
        process.stdout.write(JSON.stringify(log) + EOL)
      }
    }
  } else if (showErrors && !showStdout) {
    callback = function (e) {
      if (e) {
        console.error(e)
      }
    }
  } else if (!showErrors && showStdout) {
    callback = function (e, log) {
      if (!e) {
        process.stdout.write(JSON.stringify(log) + EOL)
      }
    }
  }

  return function insert (collection, log, cliCallback) {
    collection.insertOne(log, options)
      .then(() => {
        callback && nextTick(() => callback(null, log))
        cliCallback && nextTick(() => cliCallback())
      })
      .catch(error => {
        callback && callback(error, log)
        cliCallback && cliCallback(error)
      })
  }
}

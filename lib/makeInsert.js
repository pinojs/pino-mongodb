'use strict'

const EOL = require('os').EOL
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
        callback && callback(null, log)
        cliCallback && cliCallback()
      })
      .catch(error => {
        callback && callback(error, log)
        cliCallback && cliCallback(error)
      })
  }
}

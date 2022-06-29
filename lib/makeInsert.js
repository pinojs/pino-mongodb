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

  return function insert (collection, log) {
    collection.insertOne(log, options, (e, result) => {
      callback && callback(e, log)
    })
  }
}

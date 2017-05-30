'use strict'

module.exports = function insertInit (showErrors, showStdout) {
  let callback

  if (showErrors && showStdout) {
    callback = function (e, result) {
      if (e) {
        console.error(e)
        return
      }
      process.stdout.write(JSON.stringify(result.ops[0]) + '\n')
    }
  } else if (showErrors && !showStdout) {
    callback = function (e) {
      if (e) {
        console.error(e)
      }
    }
  } else if (!showErrors && showStdout) {
    callback = function (e, result) {
      process.stdout.write(JSON.stringify(result.ops[0]) + '\n')
    }
  }

  return function insert (collection, log) {
    collection.insertOne(log, {
      forceServerObjectId: true
    }, callback)
  }
}

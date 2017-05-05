'use strict'

module.exports = function insertInit (showErrors, showStdout) {
  var callback

  if (showErrors && showStdout) {
    callback = function (e, result) {
      if (e) {
        console.error(e)
        return
      }
      console.log(JSON.stringify(result.ops[0]))
    }
  } else if (showErrors && !showStdout) {
    callback = function (e) {
      if (e) {
        console.error(e)
      }
    }
  } else if (!showErrors && showStdout) {
    callback = function (e, result) {
      console.log(JSON.stringify(result.ops[0]))
    }
  }

  return function insert (collection, log) {
    collection.insertOne(log, {
      forceServerObjectId: true
    }, callback)
  }
}

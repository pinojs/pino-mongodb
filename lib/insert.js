module.exports = function insert (data) {
  const jsonParse = this.jsonParse || require('fast-json-parse')
  let log = jsonParse(data)

  if (log.value) {
    log = log.value
  } else {
    log = {
      msg: data
    }
  }

  this.collection.insertOne(log, function insertOne (e) {
    if (e && this.program.showInsertErrors) {
      console.error(e)
    }
  })
}

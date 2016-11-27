module.exports = function insert (data) {
  let log

  try {
    log = JSON.parse(data)
  } catch (e) {
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

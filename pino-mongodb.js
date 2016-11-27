#!/usr/bin/env node
var pkg = require('./package.json')
var MongoClient = require('mongodb').MongoClient
var params = require('commander')
var jsonParse = require('fast-json-parse')

params
  .version(pkg.version)
  .description(pkg.description)
  .option('-H, --host <address>', 'DataBase host (localhost)', 'localhost')
  .option('-P, --port <number>', 'DataBase port (27017)', 27017)
  .option('-d, --db <name>', 'DataBase name (logs)', 'logs')
  .option('-c, --collection <name>', 'DataBase collection name (logs)', 'logs')
  .option('-u, --user <username>', 'DataBase username (root)', 'root')
  .option('-p, --pass <password>', 'DataBase password (null)', null)
  .parse(process.argv)

params.host = process.env.DB_HOST || params.host
params.port = process.env.DB_PORT || params.port
params.db = process.env.DB_NAME || params.db
params.collection = process.env.DB_COLLECTION || params.collection
params.user = process.env.DB_USER || params.user
params.pass = process.env.DB_PASS || params.pass

MongoClient.connect(makeMongoOptions(params), onConnection)
process.stdin.pipe(process.stdout)

function onConnection (e, db) {
  if (e) {
    return handleError(e)
  }

  var collection = db.collection(params.collection)

  process.on('SIGINT', function () {
    db.close(function () {
      process.exit()
    })
  })

  process.stdin.on('data', function stdin (data) {
    var document = {}
    var json = jsonParse(data).value

    if (json) {
      document = json
    } else {
      document = {
        msg: data
      }
    }

    collection.insertOne(document, function insertOne (e) {
      if (e) {
        return handleError(e)
      }
    })
  })
}

function handleError (e) {
  if (e instanceof Error) {
    console.error(e)
  } else {
    console.error(new Error(e))
  }
}

function makeMongoOptions (params) {
  var string = 'mongodb://'
  if (params.user && params.pass) {
    string += '[' + params.user + ':' + params.pass + ']@'
  }
  string += params.host
  string += ':' + params.port
  string += '/' + params.db
  return string
}

module.exports = {
  onConnection: onConnection,
  handleError: handleError,
  makeMongoOptions: makeMongoOptions
}

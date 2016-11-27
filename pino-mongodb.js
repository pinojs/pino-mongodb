#!/usr/bin/env node
'use strict'

const pkg = require('./package.json')
const MongoClient = require('mongodb').MongoClient
const readline = require('readline')
const params = require('commander')

params
  .version(pkg.version)
  .description(pkg.description)
  .option('-H, --host <address>', 'DataBase host (localhost)', 'localhost')
  .option('-P, --port <number>', 'DataBase port (27017)', 27017)
  .option('-d, --db <name>', 'DataBase name (logs)', 'logs')
  .option('-c, --collection <name>', 'DataBase collection name (logs)', 'logs')
  .option('-u, --user <username>', 'DataBase username (root)', 'root')
  .option('-p, --pass <password>', 'DataBase password (null)', null)
  .option('-q, --quiet', 'Suppress output', false)
  .parse(process.argv)

params.host = process.env.DB_HOST || params.host
params.port = process.env.DB_PORT || params.port
params.db = process.env.DB_NAME || params.db
params.collection = process.env.DB_COLLECTION || params.collection
params.user = process.env.DB_USER || params.user
params.pass = process.env.DB_PASS || params.pass

if (require.main === module) {
  main()
}

function main () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: !params.quiet
  })

  MongoClient.connect(makeMongoOptions(params), function onConnection (e, db) {
    if (e) {
      return handleError(e)
    }

    const collection = db.collection(params.collection)

    process.on('SIGINT', function () {
      db.close(function () {
        process.exit()
      })
    })

    rl.on('line', stdin.bind({ collection: collection }))
  })
}

function stdin (data) {
  let document = {}
  const jsonParse = this.jsonParse || require('fast-json-parse')
  const json = jsonParse(data).value

  if (json) {
    document = json
  } else {
    document = {
      msg: data
    }
  }

  this.collection.insertOne(document, function insertOne (e) {
    if (e && params.quiet) {
      return handleError(e)
    }
  })
}

function makeMongoOptions (params) {
  let string = 'mongodb://'
  if (params.user && params.pass) {
    string += '[' + params.user + ':' + params.pass + ']@'
  }
  string += params.host
  string += ':' + params.port
  string += '/' + params.db
  return string
}

function handleError (e) {
  if (e instanceof Error) {
    console.error(e)
  } else {
    console.error(new Error(e))
  }
}

module.exports = {
  handleError: handleError,
  makeMongoOptions: makeMongoOptions,
  stdin: stdin
}

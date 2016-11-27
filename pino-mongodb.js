#!/usr/bin/env node
'use strict'

const pkg = require('./package.json')
const MongoClient = require('mongodb').MongoClient
const readline = require('readline')
const params = require('commander')

params
  .version(pkg.version)
  .description(pkg.description)
  .option('-H, --host <address>', 'set database host (localhost)', 'localhost')
  .option('-P, --port <number>', 'set database port (27017)', 27017)
  .option('-d, --db <name>', 'set database name (logs)', 'logs')
  .option('-c, --collection <name>', 'set database collection (logs)', 'logs')
  .option('-u, --user <username>', 'set database username', undefined)
  .option('-p, --pass <password>', 'set database password', undefined)
  .option('-q, --quiet', 'suppress stdin to stdout output (false)', false)
  .option('--show-insert-errors', 'show errors from inserting documents into mongodb (true)', true)
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

    process.on('SIGINT', function () {
      db.close(function () {
        process.exit()
      })
    })

    rl.on('line', stdin.bind({
      collection: db.collection(params.collection)
    }))
  })
}

function stdin (data) {
  const jsonParse = this.jsonParse || require('fast-json-parse')
  const params = this.params || params
  const json = jsonParse(data).value
  let document = {}

  if (json) {
    document = json
  } else {
    document = {
      msg: data
    }
  }

  this.collection.insertOne(document, function insertOne (e) {
    if (e && params.showInsertErrors) {
      return handleError(e)
    }
  })
}

function makeMongoOptions (params) {
  let string = 'mongodb://'
  if (params.user && params.pass) {
    string += '[' + params.user + ':' + params.pass + ']@'
  }
  string += params.host + ':' + params.port + '/' + params.db
  return string
}

function handleError (e) {
  if (e instanceof Error) {
    console.error(e)
    return e
  } else {
    const error = new Error(e)
    console.error(error)
    return error
  }
}

module.exports = {
  handleError: handleError,
  makeMongoOptions: makeMongoOptions,
  stdin: stdin
}

#!/usr/bin/env node
'use strict'

const pkg = require('./package.json')
const MongoClient = require('mongodb').MongoClient
const readline = require('readline')
const program = require('commander')

program
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

program.host = process.env.DB_HOST || program.host
program.port = process.env.DB_PORT || program.port
program.db = process.env.DB_NAME || program.db
program.collection = process.env.DB_COLLECTION || program.collection
program.user = process.env.DB_USER || program.user
program.pass = process.env.DB_PASS || program.pass

if (require.main === module) {
  main()
}

function main () {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: !program.quiet
  })

  MongoClient.connect(makeMongoOptions(program), function onConnection (e, db) {
    if (e) {
      return handleError(e)
    }

    process.on('SIGINT', function () {
      db.close(function () {
        process.exit()
      })
    })

    rl.on('line', stdin.bind({
      collection: db.collection(program.collection)
    }))
  })
}

function stdin (data) {
  const jsonParse = this.jsonParse || require('fast-json-parse')
  const program = this.program || program
  let log = jsonParse(data)

  if (log.value) {
    log = log.value
  } else {
    log = {
      msg: data
    }
  }

  this.collection.insertOne(log, function insertOne (e) {
    if (e && program.showInsertErrors) {
      return handleError(e)
    }
  })
}

function makeMongoOptions (program) {
  let string = 'mongodb://'
  if (program.user && program.pass) {
    string += '[' + program.user + ':' + program.pass + ']@'
  }
  string += program.host + ':' + program.port + '/' + program.db
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

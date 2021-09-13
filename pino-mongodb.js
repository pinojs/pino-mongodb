#!/usr/bin/env node
'use strict'

const carrier = require('carrier')
const program = require('commander')
const MongoClient = require('mongodb').MongoClient
const parseMongoUrl = require('muri')
const log = require('./lib/log')
const pkg = require('./package.json')
const makeInsert = require('./lib/makeInsert')
const transport = require('./lib/pino-transport')

module.exports = transport

if (require.main === module) {
  // used as cli
  cli()
}

function cli () {
  program
    .version(pkg.version)
    .description(pkg.description)
    .arguments('[mongo-url]')
    .option('-c, --collection <name>', 'database collection', transport.defaultOption.collection)
    .option('-o, --stdout', 'output inserted documents into stdout', false)
    .option('-e, --errors', 'output insertion errors into stderr', false)
    .option('-u, --unified', 'use mongodb unified topology', transport.defaultOption.unified)
    .parse(process.argv)

  const mongoUrl = (program.args[0] || transport.defaultOption.uri)

  function handleConnection (e, mClient) {
    if (e) {
      throw e
    }

    const dbName = parseMongoUrl(mongoUrl).db

    const db = mClient.db(dbName)
    const emitter = carrier.carry(process.stdin)
    const collection = db.collection(program.collection)
    const insert = makeInsert(program.errors, program.stdout)

    emitter.on('line', (line) => {
      insert(collection, log(line))
    })

    process.on('SIGINT', () => {
      mClient.close(process.exit)
    })
  }

  const options = { useNewUrlParser: true }
  if (program.unified) { options.useUnifiedTopology = true }

  MongoClient.connect(
    mongoUrl,
    options,
    handleConnection
  )
}

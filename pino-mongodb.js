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
    .parse(process.argv)

  const cliOptions = program.opts()
  const mongoUrl = (program.args[0] || transport.defaultOption.uri)

  function handleConnection (e, mClient) {
    if (e) {
      throw e
    }

    const dbName = parseMongoUrl(mongoUrl).db

    const db = mClient.db(dbName)
    const emitter = carrier.carry(process.stdin)
    const collection = db.collection(cliOptions.collection)
    const insert = makeInsert(cliOptions.errors, cliOptions.stdout)

    emitter.on('line', (line) => {
      insert(collection, log(line))
    })

    process.on('SIGINT', () => {
      mClient.close(process.exit)
    })
  }

  const options = {}

  MongoClient.connect(
    mongoUrl,
    options,
    handleConnection
  )
}

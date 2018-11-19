#!/usr/bin/env node
'use strict'

const carrier = require('carrier')
const program = require('commander')
const MongoClient = require('mongodb').MongoClient
const log = require('./lib/log')
const pkg = require('./package.json')
const makeUrl = require('./lib/makeUrl')
const makeInsert = require('./lib/makeInsert')
const argv = process.argv

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-U, --url <url>', 'complete database url')
  .option('-H, --host <address>', 'database host (localhost)', 'localhost')
  .option('-P, --port <number>', 'database port (27017)', 27017)
  .option('-d, --db <name>', 'database name (logs)', 'logs')
  .option('-c, --collection <name>', 'database collection (logs)', 'logs')
  .option('-u, --username <username>', 'username for authentication')
  .option('-p, --password <password>', 'password for authentication')
  .option('-o, --stdout', 'output inserted documents into stdout (false)', false)
  .option('-e, --errors', 'output insertion errors into stderr (false)', false)
  .parse(argv)

MongoClient.connect(makeUrl(program), function onConnection (e, db) {
  if (e) {
    throw e
  }

  const emitter = carrier.carry(process.stdin)
  const collection = db.collection(program.collection)
  const insert = makeInsert(program.errors, program.stdout)

  emitter.on('line', function (data) {
    insert(collection, log(data))
  })

  process.on('SIGINT', function () {
    db.close(function () {
      process.exit()
    })
  })
})

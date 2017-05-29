#!/usr/bin/env node
'use strict'

var carrier = require('carrier')
var program = require('commander')
var MongoClient = require('mongodb').MongoClient
var pkg = require('./package.json')
var makeUrl = require('./lib/makeUrl')
var makeLog = require('./lib/makeLog')
var makeInsert = require('./lib/insert')

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
  .parse(process.argv)

MongoClient.connect(makeUrl(program), function onConnection (e, db) {
  if (e) {
    throw e
  }

  var emitter = carrier.carry(process.stdin)
  var collection = db.collection(program.collection)
  var insert = makeInsert(program.errors, program.stdout)

  emitter.on('line', function (data) {
    insert(collection, makeLog(data))
  })

  process.on('SIGINT', function () {
    db.close(function () {
      process.exit()
    })
  })
})

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
  .option('-H, --host <address>', 'set database host (localhost)', 'localhost')
  .option('-P, --port <number>', 'set database port (27017)', 27017)
  .option('-d, --db <name>', 'set database name (logs)', 'logs')
  .option('-c, --collection <name>', 'set database collection (logs)', 'logs')
  .option('-u, --username <username>', 'username for authentication')
  .option('-p, --password <password>', 'password for authentication')
  .option('-o, --stdout', 'stdout inserted documents (false)', false)
  .option('-e, --errors', 'stderr insertion errors (false)', false)
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

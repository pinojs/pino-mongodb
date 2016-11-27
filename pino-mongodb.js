#!/usr/bin/env node
'use strict'

const pkg = require('./package.json')
const MongoClient = require('mongodb').MongoClient
const program = require('commander')
const insert = require('./lib/insert')
const makeOptions = require('./lib/makeOptions')
const readline = require('readline')

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: !program.quiet
})

MongoClient.connect(makeOptions(program), function onConnection (e, db) {
  if (e) {
    throw e
  }

  process.on('SIGINT', function () {
    db.close(function () {
      process.exit()
    })
  })

  rl.on('line', insert.bind({
    collection: db.collection(program.collection),
    program: program
  }))
})

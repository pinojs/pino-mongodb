'use strict'

const t = require('tap')
const { spawn } = require('child_process')
const { promisify } = require('util')
const { MongoClient } = require('mongodb')
const { once } = require('events')

const mongoUrl = 'mongodb://one:two@localhost:27017/dbname?authSource=admin'
const setTimeout = promisify(global.setTimeout)

t.test('must log to a custom collection', async () => {
  const customCollection = 'custom-collection'
  const process = spawn('node', [
    '../../pino-mongodb.js',
    mongoUrl,
    '-c',
    customCollection
  ], {
    cwd: __dirname,
    killSignal: 'SIGINT',
    stdio: ['pipe', 'inherit', 'inherit']
  })

  const client = new MongoClient(mongoUrl)
  await client.connect()
  t.teardown(client.close.bind(client))
  const db = client.db()
  const collection = db.collection(customCollection)

  const rowsBefore = await collection.countDocuments()

  process.stdin.write('hello pino-mongo 1\n')
  process.stdin.write(`${JSON.stringify({ hello: 'pino' })}\n`)
  process.stdin.write('hello pino-mongo 2\n')

  await setTimeout(1000)

  const rowsAfter = await collection.countDocuments()
  t.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')

  process.kill('SIGINT')

  await once(process, 'close')
})

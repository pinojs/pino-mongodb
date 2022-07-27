'use strict'

const t = require('tap')
const { spawn } = require('child_process')
const { MongoClient } = require('mongodb')
const { once } = require('events')

const mongoUrl = 'mongodb://one:two@localhost:27017/newdb?authSource=admin'

t.test('must log to a custom collection', async (t) => {
  const customCollection = 'custom-collection'
  const childProcess = spawn('node', [
    '../../pino-mongodb.js',
    mongoUrl,
    '-c',
    customCollection
  ], {
    cwd: __dirname,
    stdio: ['pipe', null, null]
  })

  const client = new MongoClient(mongoUrl)
  await client.connect()
  t.teardown(client.close.bind(client))
  const db = client.db()
  const collection = db.collection(customCollection)

  const rowsBefore = await collection.countDocuments()
  t.pass(`rows count ${rowsBefore}`)

  childProcess.stdin.write('hello pino-mongo 1\n')
  childProcess.stdin.write(`${JSON.stringify({ hello: 'pino' })}\n`)
  childProcess.stdin.write('hello pino-mongo 2\n')
  childProcess.stdin.end()

  try {
    await once(childProcess, 'close')
    const rowsAfter = await collection.countDocuments()
    t.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
  } catch (error) {
    t.error(error)
  }
})

t.test('must exit when the stdin is destroyed', async (t) => {
  const customCollection = 'custom-collection'
  const childProcess = spawn('node', [
    '../../pino-mongodb.js',
    mongoUrl,
    '-c',
    customCollection
  ], {
    cwd: __dirname,
    stdio: ['pipe', null, null]
  })

  childProcess.stdin.end()

  try {
    await once(childProcess, 'close')
    t.pass('pino-mongo exits')
  } catch (error) {
    t.error(error)
  }
})

t.test('must write logs to the console with -o option', async (t) => {
  const customCollection = 'custom-collection'
  const childProcess = spawn('node', [
    '../../pino-mongodb.js',
    mongoUrl,
    '-o',
    '-c',
    customCollection
  ], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', process.stderr]
  })

  const client = new MongoClient(mongoUrl)
  await client.connect()
  t.teardown(client.close.bind(client))
  const db = client.db()
  const collection = db.collection(customCollection)

  const rowsBefore = await collection.countDocuments()
  t.pass(`rows count ${rowsBefore}`)

  childProcess.stdin.write('hello pino-mongo 1\n')
  childProcess.stdin.write(`${JSON.stringify({ hello: 'pino' })}\n`)
  childProcess.stdin.write('hello pino-mongo 2\n')
  childProcess.stdin.end()

  // read stdout
  const chunks = []
  for await (let chunk of childProcess.stdout) {
    chunks.push(chunk)
  }
  const output = Buffer.concat(chunks).toString()
  t.equal(output.trim().split('\n').length, 3)

  try {
    await once(childProcess, 'close')
    const rowsAfter = await collection.countDocuments()
    t.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
  } catch (error) {
    t.error(error)
  }
})

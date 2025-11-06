'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { once } = require('node:events')
const { promisify } = require('node:util')
const pino = require('pino')
const { MongoClient } = require('mongodb')

const setTimeout = promisify(global.setTimeout)

test('auth transport test', async (t) => {
  const options = {
    uri: 'mongodb://localhost:27017/',
    database: 'logs',
    collection: 'log-test',
    mongoOptions: {
      authMechanism: 'SCRAM-SHA-1',
      auth: {
        username: 'one',
        password: 'two'
      }
    }
  }

  const client = new MongoClient(options.uri, options.mongoOptions)
  await client.connect()
  t.after(client.close.bind(client))
  const db = client.db(options.database)
  const collection = db.collection(options.collection)

  const rowsBefore = await collection.countDocuments()

  const transport = pino.transport({
    target: '../../pino-mongodb.js',
    level: 'info',
    options
  })
  const log = pino(transport)
  await once(transport, 'ready')
  log.info('this is a string log')
  log.debug('ignored')
  log.info('this is a long string log'.repeat(1000))
  log.fatal(new Error('ops'), 'not ignored')
  assert.ok('logged on mongo')

  await setTimeout(1000)
  const rowsAfter = await collection.countDocuments()
  assert.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
})

test('auth transport test', async (t) => {
  const options = {
    uri: 'mongodb://one:two@localhost:27017/dbname?authSource=admin',
    collection: 'log-test'
  }

  const client = new MongoClient(options.uri)
  await client.connect()
  t.after(client.close.bind(client))
  const db = client.db()
  const collection = db.collection(options.collection)

  const rowsBefore = await collection.countDocuments()

  const transport = pino.transport({
    target: '../../pino-mongodb.js',
    level: 'info',
    options
  })
  const log = pino(transport)
  await once(transport, 'ready')
  log.info('this is a string log')
  log.debug('ignored')
  log.info('this is a long string log'.repeat(1000))
  log.fatal(new Error('ops'), 'not ignored')
  assert.ok('logged on mongo')

  await setTimeout(1000)
  const rowsAfter = await collection.countDocuments()
  assert.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
})

test('log blocked items', async (t) => {
  const options = {
    uri: 'mongodb://one:two@localhost:27017/dbname?authSource=admin',
    collection: 'log-block'
  }

  const client = new MongoClient(options.uri)
  await client.connect()
  t.after(client.close.bind(client))
  const db = client.db()
  const collection = db.collection(options.collection)

  const rowsBefore = await collection.countDocuments()

  const transport = pino.transport({
    target: '../../pino-mongodb.js',
    level: 'info',
    options
  })
  const log = pino(transport)

  await once(transport, 'ready')
  log.info({ query: { $and: [{ a: 1 }, { b: 2 }] } }, 'my query was')
  log.info({ 'foo.bar': 42 }, 'dot object')
  assert.ok('logged on mongo')

  await setTimeout(1000)

  const rowsAfter = await collection.countDocuments()
  assert.equal(rowsAfter, rowsBefore + 2, 'log not inserted due the mongo limitation')

  log.info('the stream is open')
  await setTimeout(1000)
  const rowsInserted = await collection.countDocuments()
  assert.equal(rowsInserted, rowsAfter + 1, 'logs are still working')
})

test('custom parse line function', async (t) => {
  const options = {
    uri: 'mongodb://localhost:27017/',
    database: 'logs',
    collection: 'log-test',
    mongoOptions: {
      authMechanism: 'SCRAM-SHA-1',
      auth: {
        username: 'one',
        password: 'two'
      }
    }
  }

  const client = new MongoClient(options.uri, options.mongoOptions)
  await client.connect()
  t.after(client.close.bind(client))
  const db = client.db(options.database)
  const collection = db.collection(options.collection)

  const rowsBefore = await collection.countDocuments()

  const transport = pino.transport({
    target: '../fixture/wrap-transport.js',
    level: 'info',
    options
  })
  const log = pino(transport)
  await once(transport, 'ready')
  log.info('this is a string log')
  log.debug('ignored')
  log.info('this is a long string log'.repeat(1000))
  log.fatal(new Error('ops'), 'not ignored')
  assert.ok('logged on mongo')

  await setTimeout(1000)
  const rowsAfter = await collection.countDocuments()
  assert.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
})

test('invalid custom parse line function', async (t) => {
  const options = {
    uri: 'mongodb://localhost:27017/',
    database: 'logs',
    collection: 'log-test',
    mongoOptions: {
      authMechanism: 'SCRAM-SHA-1',
      auth: {
        username: 'one',
        password: 'two'
      }
    },
    parseLine: false
  }

  const client = new MongoClient(options.uri, options.mongoOptions)
  await client.connect()
  t.after(client.close.bind(client))
  const db = client.db(options.database)
  const collection = db.collection(options.collection)

  const rowsBefore = await collection.countDocuments()

  const transport = pino.transport({
    target: '../../pino-mongodb.js',
    level: 'info',
    options
  })
  const log = pino(transport)
  await once(transport, 'ready')
  log.info('this is a string log')
  log.debug('ignored')
  log.info('this is a long string log'.repeat(1000))
  log.fatal(new Error('ops'), 'not ignored')
  assert.ok('logged on mongo')

  await setTimeout(1000)
  const rowsAfter = await collection.countDocuments()
  assert.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
})

'use strict'

const t = require('tap')
const { once } = require('events')
const { promisify } = require('util')
const pino = require('pino')
const { MongoClient } = require('mongodb')

const setTimeout = promisify(global.setTimeout)

t.test('auth transport test', async (t) => {
  const options = {
    uri: 'mongodb://localhost:27017/',
    database: 'logs',
    collection: 'log-test',
    mongoOptions: {
      useNewUrlParser: true,
      authMechanism: 'SCRAM-SHA-1',
      auth: {
        username: 'one',
        password: 'two'
      }
    }
  }

  const client = new MongoClient(options.uri, options.mongoOptions)
  await client.connect()
  t.teardown(client.close.bind(client))
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
  t.pass('logged on mongo')

  await setTimeout(1000)
  const rowsAfter = await collection.countDocuments()
  t.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
})

t.test('auth transport test', async (t) => {
  const options = {
    uri: 'mongodb://one:two@localhost:27017/dbname?authSource=admin',
    collection: 'log-test'
  }

  const client = new MongoClient(options.uri, options.mongoOptions)
  await client.connect()
  t.teardown(client.close.bind(client))
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
  t.pass('logged on mongo')

  await setTimeout(1000)
  const rowsAfter = await collection.countDocuments()
  t.equal(rowsAfter, rowsBefore + 3, 'logged 3 rows')
})

'use strict'

const t = require('tap')
const { once } = require('events')
const pino = require('pino')

t.test('basic transport test', async (t) => {
  const transport = pino.transport({
    target: '../pino-mongodb.js',
    level: 'info',
    options: {
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
  })
  const log = pino(transport)
  await once(transport, 'ready')
  log.info('this is a string log')
  log.info('this is a long string log'.repeat(100))
})

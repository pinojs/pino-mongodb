'use strict'

const { Writable } = require('stream')
const { MongoClient } = require('mongodb')
const build = require('pino-abstract-transport')

const log = require('./log')

const defaultOption = {
  uri: 'mongodb://localhost:27017/logs',
  collection: 'logs',
  unified: false,
  mongoOptions: {
    appName: 'pino-mongodb'
  }
}

async function mongodbTransport (opts) {
  const {
    uri,
    database: databaseName,
    collection: collectionName,
    mongoOptions
  } = Object.assign({}, defaultOption, opts)

  const client = new MongoClient(uri, mongoOptions)
  await client.connect()

  const db = client.db(databaseName)
  const collection = db.collection(collectionName)

  const mongoStream = new Writable({
    objectMode: true,
    autoDestroy: true,
    write (chunk, enc, cb) {
      // todo: bulk insert?
      collection.insertOne(log(chunk), {
        forceServerObjectId: true
      }, cb)
    },
    destroy (err, cb) {
      client.close((closeErr) => {
        cb(err || closeErr)
      })
    }
  })

  return build(function (source) {
    source.pipe(mongoStream)
  }, {
    close (err, cb) {
      mongoStream.end()
      mongoStream.once('close', cb.bind(null, err))
    }
  })
}

module.exports = mongodbTransport
module.exports.defaultOption = defaultOption

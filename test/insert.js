const t = require('tap')
const insert = require('../lib/insert')
const sinon = require('sinon')

t.test('insert', t => {
  t.comment('Function that writes data into mongodb')

  t.test('data is an object', t => {
    const value = {
      msg: 'awesome message',
      name: 'awesome',
      v: 1
    }
    const valueStr = JSON.stringify(value)
    const context = {
      jsonParse: sinon.stub().returns({
        err: null,
        value
      }),
      program: {},
      collection: {
        insertOne: sinon.stub()
      }
    }
    insert.call(context, valueStr)
    t.equal(context.jsonParse.callCount, 1, 'jsonParse should be called once')
    t.equal(context.collection.insertOne.callCount, 1, 'insertOne should be called once')
    t.equal(context.jsonParse.args[0][0], valueStr, 'jsonParse first argument should equals valueStr')
    t.deepEqual(context.collection.insertOne.args[0][0], value, 'insertOne first argument should equals value')
    t.end()
  })

  t.test('data is a string', t => {
    const value = 'What an awkward situation, but we do have solution'
    const context = {
      jsonParse: sinon.stub().returns({
        err: new Error(),
        value: null
      }),
      program: {},
      collection: {
        insertOne: sinon.stub()
      }
    }
    const log = {
      msg: value
    }
    insert.call(context, value)
    t.equal(context.jsonParse.callCount, 1, 'jsonParse should be called once')
    t.equal(context.collection.insertOne.callCount, 1, 'insertOne should be called once')
    t.equal(context.jsonParse.args[0][0], value, 'jsonParse first argument should equals valueStr')
    t.deepEqual(context.collection.insertOne.args[0][0], log, 'insertOne first argument should equals value')
    t.end()
  })

  t.end()
})

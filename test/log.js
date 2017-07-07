'use strict'

const t = require('tap')
const log = require('../lib/log')

t.test('log', t => {
  t.test('valid input', t => {
    const expected = { a: 1 }
    const actual = log(JSON.stringify(expected))

    t.deepEqual(actual, expected)
    t.end()
  })

  t.test('invalid input', t => {
    const expected = { msg: 'message' }
    const actual = log('message')

    t.deepEqual(actual, expected)
    t.end()
  })

  t.end()
})

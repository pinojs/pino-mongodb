'use strict'

const t = require('tap')
const log = require('../lib/log')

t.test('log', t => {
  t.test('valid input', t => {
    const expected = { a: 1 }
    const actual = log(JSON.stringify(expected))

    t.same(actual, expected)
    t.end()
  })

  t.test('valid input with time as Date', t => {
    const now = Date.now()
    const expected = {
      a: 1,
      time: new Date(now)
    }
    const actual = log(JSON.stringify({
      a: expected.a,
      time: now
    }))

    t.same(actual, expected)
    t.end()
  })

  t.test('invalid input', t => {
    const expected = { msg: 'message' }
    const actual = log('message')

    t.same(actual, expected)
    t.end()
  })

  t.test('do not mutate object', t => {
    const expected = { msg: 'message' }
    const actual = log(expected)

    t.same(actual, expected)
    t.end()
  })

  t.end()
})

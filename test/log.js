'use strict'

const test = require('node:test')
const assert = require('node:assert')
const log = require('../lib/log')

test('valid input', t => {
  const expected = { a: 1 }
  const actual = log(JSON.stringify(expected))

  assert.deepEqual(actual, expected)
})

test('valid input with time as Date', t => {
  const now = Date.now()
  const expected = {
    a: 1,
    time: new Date(now)
  }
  const actual = log(JSON.stringify({
    a: expected.a,
    time: now
  }))

  assert.deepEqual(actual, expected)
})
test('valid input with timestamp as Date', t => {
  const now = Date.now()
  const expected = {
    a: 1,
    timestamp: new Date(now)
  }
  const actual = log(JSON.stringify({
    a: expected.a,
    timestamp: now
  }))

  assert.deepEqual(actual, expected)
})

test('invalid input', t => {
  const expected = { msg: 'message' }
  const actual = log('message')

  assert.deepEqual(actual, expected)
})

test('do not mutate object', t => {
  const expected = { msg: 'message' }
  const actual = log(expected)

  assert.deepEqual(actual, expected)
})

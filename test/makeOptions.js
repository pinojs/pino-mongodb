const t = require('tap')
const makeOptions = require('../lib/makeOptions')

t.test('makeOptions', t => {
  t.comment('Function that gets params from commander and make mongo options string from them')

  t.test('without user and pass', t => {
    const options = makeOptions({
      user: 'me',
      pass: 'pass',
      host: 'localhost',
      port: 27017,
      db: 'logs'
    })
    t.ok(options, 'options ok')
    t.equal(options, 'mongodb://[me:pass]@localhost:27017/logs', 'options should are right')
    t.end()
  })

  t.test('with user and pass', t => {
    const options = makeOptions({
      host: 'localhost',
      port: 27017,
      db: 'logs'
    })
    t.ok(options, 'options ok')
    t.equal(options, 'mongodb://localhost:27017/logs', 'options should are right')
    t.end()
  })

  t.end()
})


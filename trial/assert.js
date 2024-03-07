const MongoClient = require('mongodb').MongoClient
const t = require('assert').strict

async function main () {
  const url = process.argv.slice(2, 3)[0]
  const conn = await MongoClient.connect(url)
  const db = conn.db('admin')
  const logs = db.collection('logs')

  const data = await logs.find().toArray()

  const valid = data.filter(x => x.txt)
  console.log('valid', valid)
  t.ok(valid.length, 'should have found valid insertions')

  const notValid = data.filter(x => x.msg)
  console.log('notValid', notValid)
  t.ok(notValid.length, 'should have found invalid insertions')

  const time = data.filter(x => x.time)
  console.log('time', time)
  t.ok(time[0].time, 'should have found time-based insertions')

  await conn.close()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

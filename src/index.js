const pkg = require("../package.json")
const { MongoClient } = require("mongodb")
const program = require("commander")

program
  .version(pkg.version)
  .option("-H, --host <host>", "DataBase host (127.0.0.1)", "127.0.0.1")
  .option("-P, --port <port>", "DataBase port (27017)", "27017")
  .option("-d, --db <name>", "DataBase name (logs)", "logs")
  .option("-c, --collection <name>", "DataBase collection name (logs)", "logs")
  .option("-u, --user <username>", "DataBase username (root)", "root")
  .option("-p, --pass <password>", "DataBase username password ()", "")
  .parse(process.argv)

main()
  .catch(e => {
    if (e.message) {
      console.error(e)
    } else {
      console.error(new Error(e))
    }
  })

async function main() {

  const auth = program.user && program.pass
    ? `[${program.user}:${program.pass}]@`
    : ""
  const url = `mongodb://${auth}${program.host}:${program.port}/${program.db}`
  const db = await MongoClient.connect(url)
  const collection = db.collection(program.collection)

  process.stdin.resume()
  process.stdin.setEncoding("utf8")
  process.stdin.on("data", async function(data) {
    let document = null
    try {
      document = JSON.parse(data)
    } catch (e) {
      document = {
        msg: data
      }
    }
    await collection.insertOne(document)
    process.stdout.write(JSON.stringify(document) + "\n")
  })

}

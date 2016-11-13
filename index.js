var pkg = require("./package.json")
var MongoClient = require("mongodb").MongoClient
var params = require("commander")
var stringify = require("fast-safe-stringify")

params
  .version(pkg.version)
  .description(pkg.description)
  .option("-H, --host <address>", "DataBase host (127.0.0.1)", "127.0.0.1")
  .option("-P, --port <number>", "DataBase port (27017)", "27017")
  .option("-d, --db <name>", "DataBase name (logs)", "logs")
  .option("-c, --collection <name>", "DataBase collection name (logs)", "logs")
  .option("-u, --user <username>", "DataBase username (root)", "root")
  .option("-p, --pass <password>", "DataBase username password ()", "")
  .parse(process.argv)

var mongoOptions = "mongodb://"
  + (params.user && params.pass
      ? "[" + params.user + ":" + params.pass + "]@"
      : "")
  + params.host
  + ":" + params.port
  + "/" + params.db

MongoClient.connect(mongoOptions, onConnection)

function onConnection(e, db) {

  if (e) {
    return handleError(e)
  }

  var collection = db.collection(params.collection)
  
  process.on("SIGINT", function() {
    db.close(function() {
      process.exit()
    })
  })

  process.stdin.resume()
  process.stdin.setEncoding("utf8")
  process.stdin.on("data", function stdin(data) {

    var document = null

    try {
      document = JSON.parse(data)
    } catch (e) {
      document = {
        msg: data
      }
    }

    collection.insertOne(document, function insertOne(e) {
      if (e) {
        return handleError(e)
      }
    })

    process.stdout.write(stringify(document) + "\n")

  })
}

function handleError(e) {
  if (e instanceof Error) {
    console.error(e)
  } else {
    console.error(new Error(e))
  }
}

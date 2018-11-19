Usage: pino-mongodb [options]

Insert JSON from stdin into MongoDB

Options:
  -V, --version              output the version number
  -U, --url <url>            complete database url
  -H, --host <address>       database host (localhost) (default: "localhost")
  -P, --port <number>        database port (27017) (default: 27017)
  -d, --db <name>            database name (logs) (default: "logs")
  -c, --collection <name>    database collection (logs) (default: "logs")
  -u, --username <username>  username for authentication
  -p, --password <password>  password for authentication
  -o, --stdout               output inserted documents into stdout (false)
  -e, --errors               output insertion errors into stderr (false)
  -h, --help                 output usage information

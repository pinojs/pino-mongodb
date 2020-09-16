Usage: pino-mongodb [options] [mongo-url]

Insert JSON from stdin into MongoDB

Options:
  -V, --version            output the version number
  -c, --collection <name>  database collection (default: "logs")
  -o, --stdout             output inserted documents into stdout
  -e, --errors             output insertion errors into stderr
  -u, --unified            use mongodb unified topology
  -h, --help               output usage information

Usage: pino-mongodb [options] [mongo-url]

Insert JSON from stdin into MongoDB

Options:
  -V, --version            output the version number
  -c, --collection <name>  database collection (default: "logs")
  -o, --stdout             output inserted documents into stdout (default:
                           false)
  -e, --errors             output insertion errors into stderr (default: false)
  -u, --unified            use mongodb unified topology (default: false)
  -h, --help               display help for command

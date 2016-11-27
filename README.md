# pino-mongodb
[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Load pino logs into MongoDB

## Install

```
npm i -g pino-mongodb
```

## Usage

It takes `process.stdin` stream, parses the data and tries to insert that data into  
`mongodb`.

### With server use it like this

```
node server.js | pino-mongodb [options]
```

### Options

To define db connection you can either specify configuration with `args` or with `env`

env | describe
:--- | :---
`DB_HOST` | DataBase host
`DB_PORT` | DataBase port
`DB_NAME` | DataBase name
`DB_COLLECTION` | DataBase collection name
`DB_USER` | DataBase username
`DB_PASS` | DataBase password

**Note**: if `env` variable is defined then `argv` variable will be ignored

### Help

```
  Usage: pino-mongodb [options]

  Load pino logs into MongoDB

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -H, --host <address>     set database host (localhost)
    -P, --port <number>      set database port (27017)
    -d, --db <name>          set database name (logs)
    -c, --collection <name>  set database collection (logs)
    -u, --user <username>    set database username
    -p, --pass <password>    set database password
    -q, --quiet              suppress stdin to stdout output (false)
    --show-insert-errors     show errors from inserting documents into mongodb (true)
```

## Tests

```
npm test
```

## License

Licensed under [MIT](./LICENSE).

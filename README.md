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
    -H, --host <address>     DataBase host (localhost)
    -P, --port <number>      DataBase port (27017)
    -d, --db <name>          DataBase name (logs)
    -c, --collection <name>  DataBase collection name (logs)
    -u, --user <username>    DataBase username (root)
    -p, --pass <password>    DataBase password (null)
    -q, --quiet              Suppress stdin to stdout (false)
    --show-insert-errors     Show errors from inserting documents into mongodb (true)
```

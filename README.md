# pino-mongodb

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Load pino logs into MongoDB

## Install

```
npm i -g pino-mongodb
```

## Usage

```
node my-app.js | pino-mongodb [options]
```

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

# pino-mongodb

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Insert JSON from stdin into MongoDB

This project is part of the `pino` logger family, however you can use it to parse and insert any
`JSON` into the `mongo`.

## Install

```
npm i -g pino-mongodb
```

## Get started

```bash
echo '{"name": "Viktor"}' | pino-mongodb [options]
```

```bash
cat many.logs | pino-mongodb [options]
```

```bash
node ./app.js | pino-mongodb [options]
```

## Usage

```
  Usage: pino-mongodb [options]

  Insert JSON from stdin into MongoDB


  Options:

    -V, --version              output the version number
    -U, --url <url>            complete database url
    -H, --host <address>       database host (localhost)
    -P, --port <number>        database port (27017)
    -d, --db <name>            database name (logs)
    -c, --collection <name>    database collection (logs)
    -u, --username <username>  username for authentication
    -p, --password <password>  password for authentication
    -o, --stdout               output inserted documents into stdout (false)
    -e, --errors               output insertion errors into stderr (false)
    -h, --help                 output usage information
```

## Tests

```
npm test
```

## License

Licensed under [MIT](./LICENSE).

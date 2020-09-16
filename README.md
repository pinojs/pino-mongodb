# pino-mongodb

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Insert JSON from stdin into MongoDB

This project is part of the `pino` logger family, however you can use it to parse and insert any
`JSON` into the `mongo`.

## Install

```bash
$ npm i -g pino-mongodb
```

## Get started

```bash
$ echo '{"name": "Viktor"}' | pino-mongodb [options] [mongo-url]
```

```bash
$ cat many.logs | pino-mongodb [options] [mongo-url]
```

```bash
$ node ./app.js | pino-mongodb [options] [mongo-url]
```

## Usage

```
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
```

## Tests

To run unit tests:

```bash
$ npm t
```

To run integrational tests with real mongo server:

```bash
$ npm run trial
```

Note, you will have to have `docker` and `docker-compose` installed
on your machine for that!

## License

Licensed under [MIT](./LICENSE).

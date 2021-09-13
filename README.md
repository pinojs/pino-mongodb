# pino-mongodb
[![npm version](https://img.shields.io/npm/v/pino-mongodb)](https://www.npmjs.com/package/pino-mongodb)
[![Build Status](https://img.shields.io/github/workflow/status/pinojs/pino-mongodb/CI)](https://github.com/pinojs/pino-mongodb/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/pinojs/pino-mongodb/badge.svg)](https://snyk.io/test/github/pinojs/pino-mongodb)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

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

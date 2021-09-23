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
$ npm i pino-mongodb
```

## Usage as Pino Transport

You can use this module as a [pino transport](https://getpino.io/#/docs/transports?id=v7-transports) like so:

```js
const pino = require('pino')
const transport = pino.transport({
  target: 'pino-mongodb',
  level: 'info',
  options: {
    uri: 'mongodb://localhost:27017/',
    database: 'logs',
    collection: 'log-collection',
    mongoOptions: {
      auth: {
        username: 'one',
        password: 'two'
      }
    }
  }
})

pino(transport)
```

The `mongoOptions` is provided to the the standard mongodb client. All the available options are described on [its official documentation](https://mongodb.github.io/node-mongodb-native/4.1/interfaces/MongoClientOptions.html).

Note that you may encouter missing logs in special cases: it dependes on data and mongo's version. Please checkout the [mongodb limitation](https://docs.mongodb.com/manual/reference/limits/) official documentation.  
For example on MongoDB 4:

```js
// IT DOES NOT WORK:
log.info({ $and: [{ a: 1 }, { b: 2 }] }, 'my query is')

// IT WORKS:
log.info({ query: { $and: [{ a: 1 }, { b: 2 }]} }, 'my query is')
```

If you want a custom parser to handle the above case. You need to wrap `pino-mongo` and passa function through `option.parseLine`. Any value that is not a function will be ignored in this option.

```js
// mongo-transport.js
'use strict'

const transport = require('pino-mongodb')

module.exports = function(opts) {
  opts.parseLine = function(str) { // `str` is passed from `pino` and expected to be a string
    const obj = JSON.parse(str)
    
    // do anything you want...

    return obj // return value is expected to be a json that will pass and save inside mongodb
  }
  return transport(opts)
}

// main.js
const pino = require('pino')
const transport = pino.transport({
  target: './mongo-transport.js',
  uri: 'mongodb://localhost:27017/logs',
  collection: 'log-collection',
})
pino(transport)
```

## Usage as Pino Legacy Transport

Pino supports a [legacy transport interface](https://getpino.io/#/docs/transports?id=legacy-transports)
that is still supported by this module.

### Get started

```bash
$ echo '{"name": "Viktor"}' | pino-mongodb [options] [mongo-url]
```

```bash
$ cat many.logs | pino-mongodb [options] [mongo-url]
```

```bash
$ node ./app.js | pino-mongodb [options] [mongo-url]
```

### CLI Options

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

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
echo '{"name": "Viktor"}' | pino-mongodb [options] [mongo-url]
```

```bash
cat many.logs | pino-mongodb [options] [mongo-url]
```

```bash
node ./app.js | pino-mongodb [options] [mongo-url]
```

## Usage

```
Usage: pino-mongodb [options] [mongo-url]

Insert JSON from stdin into MongoDB

Options:
  -V, --version            output the version number
  -c, --collection <name>  database collection (default: "logs")
  -o, --stdout             output inserted documents into stdout
  -e, --errors             output insertion errors into stderr
  -h, --help               output usage information
```

## Tests

```
npm t
```

## License

Licensed under [MIT](./LICENSE).

# pino-mongodb
Load pino logs into MongoDB

## Usage

It takes `process.stdin` stream, parses the data and tries to insert that data into  
`mongodb`.

### With server use it like this

```
node server.js | pino-mongodb [options]
```

### Help

```
  Usage: pino-mongodb [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -H, --host <host>        DataBase host (127.0.0.1)
    -P, --port <port>        DataBase port (27017)
    -d, --db <name>          DataBase name (logs)
    -c, --collection <name>  DataBase collection name (logs)
    -u, --user <username>    DataBase username (root)
    -p, --pass <password>    DataBase username password ()

```

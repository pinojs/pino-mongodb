"use strict";

var pkg = require("../package.json");

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var program = require("commander");

program.version(pkg.version);

program.option("-H, --host <host>", "DataBase host").option("-P, --port <port>", "DataBase port").option("-d, --db <name>", "DataBase name").option("-c, --collection <name>", "DataBase collection name").option("-u, --user <username>", "DataBase username").option("-p, --pass <password>", "DataBase username password").action(function (options) {
  console.log(options.host);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", function (data) {
    process.stdout.write(data);
  });
});

program.parse(process.argv);
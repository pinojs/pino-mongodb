"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var main = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var auth, url, db, collection;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            auth = program.user && program.pass ? "[" + program.user + ":" + program.pass + "]@" : "";
            url = "mongodb://" + auth + program.host + ":" + program.port + "/" + program.db;
            _context2.next = 4;
            return MongoClient.connect(url);

          case 4:
            db = _context2.sent;
            collection = db.collection(program.collection);


            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", function () {
              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(data) {
                var document;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        document = null;

                        try {
                          document = JSON.parse(data);
                        } catch (e) {
                          document = {
                            msg: data
                          };
                        }
                        _context.next = 4;
                        return collection.insertOne(document);

                      case 4:
                        process.stdout.write((0, _stringify2.default)(document) + "\n");

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require("../package.json");

var _require = require("mongodb"),
    MongoClient = _require.MongoClient;

var program = require("commander");

program.version(pkg.version).option("-H, --host <host>", "DataBase host (127.0.0.1)", "127.0.0.1").option("-P, --port <port>", "DataBase port (27017)", "27017").option("-d, --db <name>", "DataBase name (logs)", "logs").option("-c, --collection <name>", "DataBase collection name (logs)", "logs").option("-u, --user <username>", "DataBase username (root)", "root").option("-p, --pass <password>", "DataBase username password ()", "").parse(process.argv);

main().catch(function (e) {
  if (e.message) {
    console.error(e);
  } else {
    console.error(new Error(e));
  }
});
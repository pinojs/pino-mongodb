const transport = require('../../lib/pino-transport')

module.exports = async function(opts) {
  opts.parseLine = function(str) {
    const obj = JSON.parse(str)
    return obj
  }
  return transport(opts)
}
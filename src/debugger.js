const dbDebugger = require("debug")('app:DB')
const debug = require('debug')('app:CONSOLE')
const routeDebugger = require('debug')('app:ROUTE')
const consoleError = require('debug')('app:ERROR')
const consoleWarning = require('debug')('app:WARNING')

module.exports = {
  dbDebugger,
  debug,
  routeDebugger,
  consoleError,
  consoleWarning
}
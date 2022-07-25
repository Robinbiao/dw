const execa = require('execa')

module.exports = function run(cwd, command, args) {
  if (!args) {
    ;[command, ...args] = command.split(/\s+/)
  }
  return execa(command, args, { cwd })
}

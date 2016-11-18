const C = require('./constants')
const {keys} = require('./utils')
const configLookup = require('./config-lookup')

// Creates gulp tasks for each provided configuration
module.exports = function createTasks (gulp, opts) {
  return function (atom) {
    const configs = configLookup(atom, opts)

    keys(configs)
      .forEach(name => {
        gulp.task(name, atom.help, atom.task(gulp, configs[name]))

        if (atom.watch) {
          gulp.task(`${name}:${C.wfix}`, atom.watch(gulp, configs[name], name))
        }
      })
  }
}

const wfix = 'watch'
const afix = 'gulp-atom-'
const keys = Object.keys
const modules = 'node_modules'
const help = require('gulp-help')
const merge = require('deepmerge')

module.exports = function (gulp, opts = {}) {
  const g = help(gulp, opts.help || {})

  atoms().forEach(atomize(g, opts))

  return g
}

// Finds and requires atoms inside your packages
function atoms () {
  const fs = require('fs')
  const path = require('path')
  const load = x => require(x)
  const atoms = x => y => (y.indexOf(x) >= 0)
  const lookup = src => fs
    .readdirSync(src)
    .filter(file => fs
      .statSync(path.join(src, file))
      .isDirectory())
    .filter(atoms(afix))
    .map(load)

  return lookup(modules)
}

// Creates gulp tasks
function atomize (gulp, opts) {
  return function (atom) {
    const configs = configLookup(atom, opts)

    keys(configs)
      .forEach(config => {
        console.log(configs[config])
        gulp.task(config, atom.help, atom.task(gulp, configs[config]))

        if (atom.watch) {
          gulp.task(`${config}:${wfix}`, atom.watch(gulp, configs[config]))
        }
      })
  }
}

// Looks for different atom configurations
function configLookup (atom, opts) {
  const byName = x => x.startsWith(atom.name)
  const toObject = (x, y) => {
    x[y] = merge(atom.config, opts[y])
    return x
  }

  const configs = keys(opts)
    .filter(byName)
    .reduce(toObject, {})

  return keys(configs).length
    ? configs
    : { [atom.name]: atom.config }
}

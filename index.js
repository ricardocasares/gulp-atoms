const fs = require('fs')
const path = require('path')
const help = require('gulp-help')
const merge = require('deepmerge')

const keys = Object.keys
const wfix = 'watch'
const afix = 'gulp-atom-'
const modules = 'node_modules'

module.exports = function (gulp, opts = {}) {
  gulp = help(gulp, opts.help || {})

  atomsLookup()
    .forEach(createTasks(gulp, opts))

  return gulp
}

// Finds and requires atoms inside your packages
function atomsLookup () {
  const join = path.join
  const byPrefix = x => y => y.startsWith(x)
  const packages = join(process.cwd(), modules)
  const load = atom => require(join(packages, atom))
  const lookup = src => fs
    .readdirSync(src)
    .filter(file => fs
      .statSync(join(src, file))
      .isDirectory())
    .filter(byPrefix(afix))
    .map(load)

  return lookup(packages)
}

// Creates gulp tasks
function createTasks (gulp, opts) {
  return function (atom) {
    const configs = configLookup(atom, opts)

    keys(configs)
      .forEach(config => {
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

  const defaultConfig = { [atom.name]: atom.config }

  return keys(configs).length
    ? configs
    : defaultConfig
}

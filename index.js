const fs = require('fs')
const path = require('path')
const help = require('gulp-help')
const merge = require('deepmerge')

const keys = Object.keys
const wfix = 'watch'
const afix = 'gulp-atom-'
const modules = 'node_modules'
const byText = str => x => x.startsWith(str)

module.exports = function (gulp, opts = {}) {
  gulp = help(gulp, opts.help || {})

  atomsLookup()
    .forEach(createTasks(gulp, opts))

  return gulp
}

// Finds and requires atoms inside your packages
function atomsLookup () {
  const join = path.join
  const packages = join(process.cwd(), modules)
  const load = atom => require(join(packages, atom))
  const lookup = src => fs
    .readdirSync(src)
    .filter(file => fs
      .statSync(join(src, file))
      .isDirectory())
    .filter(byText(afix))
    .map(load)

  return lookup(packages)
}

// Creates gulp tasks
function createTasks (gulp, opts) {
  return function (atom) {
    const configs = configLookup(atom, opts)

    keys(configs)
      .forEach(name => {
        gulp.task(name, atom.help, atom.task(gulp, configs[name]))

        if (atom.watch) {
          gulp.task(`${name}:${wfix}`, atom.watch(gulp, configs[name], name))
        }
      })
  }
}

// Looks for different atom configurations
function configLookup (atom, opts) {
  const toObject = (x, y) => {
    x[y] = merge(atom.config, opts[y])
    return x
  }

  const configs = keys(opts)
    .filter(byText(atom.name))
    .reduce(toObject, {})

  const defaultConfig = { [atom.name]: atom.config }

  return keys(configs).length
    ? configs
    : defaultConfig
}

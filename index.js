const help = require('gulp-help')
const atomsLookup = require('./lib/atoms-lookup')
const createTasks = require('./lib/create-tasks')

module.exports = function (gulp, opts = {}) {
  gulp = help(gulp, opts.help || {})

  atomsLookup()
    .forEach(createTasks(gulp, opts))

  return gulp
}

[![Build Status](https://semaphoreci.com/api/v1/ricardocasares/gulp-atoms/branches/master/badge.svg)](https://semaphoreci.com/ricardocasares/gulp-atoms)

# gulp-atoms

[![Greenkeeper badge](https://badges.greenkeeper.io/ricardocasares/gulp-atoms.svg)](https://greenkeeper.io/)

Modular and reusable gulp tasks

## Install
`npm install --save-dev gulp-atoms`

## Usage
You'll first need to install `gulp` in your project

`npm install --save-dev gulp`

And create your gulpfile like this:

```js
let gulp = require('gulp')
gulp = require('gulp-atoms')(gulp)
```

After this you are ready to start using individual atoms. To do so, install the atoms you need in your project, for example:

`npm install --save-dev gulp-atom-copy`

You can now run `> gulp` in your command line, and `gulp-atoms` will read your node modules folder looking for installed atoms and providing related tasks and help.

### Custom atom configuration

We allow to pass different configurations to your atoms, this way you don't need to duplicate tasks for different environments, for example, or simple to override the default atom configuration options.

To do so, add your atom configuration object as the second argument in `require('gulp-atoms')(gulp, {})`

For example, if we are using [gulp-atom-copy](https://github.com/ricardocasares/gulp-atom-copy), which just copies files from one folder to another, first check what the default configuration looks like, lets say it looks like this:

```js
{
  src: 'src/',
  dest: 'dist/'
}
```

If you need to change only your destination folder:

```js
let gulp = require('gulp')
gulp = require('gulp-atoms')(gulp, {
  'ac:copy': {
    dest: 'build/'
  }
})
```

`gulp-atom` always merges the default options with the ones you provided, so the final configuration will look like this:

```js
{
  src: 'src/',
  dest: 'build/'
}
```

In order to clone tasks, for example you need to copy `.js` and `.html` to different directories, just add the task name prefix, followed by a task description:

```js
let gulp = require('gulp')
gulp = require('gulp-atoms')(gulp, {
  'ac:copy:js': {
    src: 'src/**/*.js'
    dest: 'scripts/'
  },
  'ac:copy:html': {
    src: 'src/**/*.html'
    dest: 'pages/'
  }
})
```

This will provide you with 2 new tasks `ac:copy:js` and `ac:copy:html`. Note that the default task `ac:copy` will be no longer available.

### Create some molecules!

Once you have your atoms and configurations in place, it's time to create your task pipelines:

```js
let gulp = require('gulp')
const cfg = require('./atoms.config')
const seq = require('run-sequence')
gulp = require('gulp-atoms')(gulp, cfg)

// dev pipeline
const dev = [
  'ac:clean',
  ['ac:copy:idx', 'ac:sass'],
  ['ac:copy:idx:watch', 'ac:sass:watch', 'ac:bundle:watch'],
  'ac:serve'
]

// build pipeline
const build = [
  'ac:clean',
  ['ac:copy:idx', 'ac:sass', 'ac:bundle']
]

gulp
  .task('dev', cb => seq.apply(seq, dev.concat(cb)))
  .task('build', cb => seq.apply(seq, build.concat(cb)))
```

Clone the [atoms-example](https://github.com/ricardocasares/atoms-example) project to know how everything is being tied together.

## Authoring atoms

Each atom package exports a simple object that looks like this:

```js
module.exports = {
  // required
  name: 'name:of:your:task',
  // required
  help: 'A description of what your task does',
  task: function (gulp, cfg) {
    // This function receives a gulp instance and the task configuration
    // It must return a function returning a stream!
    return function () {
      const compileSass = require('gulp-sass')

      return gulp
        .src(cfg.src)
        .pipe(compileSass(cfg.sass))
        .pipe(gulp.dest(cfg.dest))
    }
  },
  // optional
  watch: function (gulp, cfg, taskName) {
    // Your atom may provide a watcher to run the task again on changes
    // This function receives the gulp instance, task configuration and the task name
    // It could be as simple as this, but will depend on your task needs.
    return () => gulp.watch(cfg.src, [taskName])
  },
  // required
  config: {
    // Your task configuration object
    src: 'path/to/src',
    dest: 'path/to/dest',
    sass: {
      // Provide specific task configuration
      outputStyle: 'compressed'
    }
  }
}
```

### Guidelines and principles

To facilitate interoperability with another atom packages make sure to follow these guidelines in order to play nice:

- Namespace your atoms to prevent collision with another atoms task names, ie: `xyz:sass`, `xyz:typescript`
- As `gulp-atoms` allows to provide custom settings to your atoms, provide sane defaults, this way you don't need to override all options.
- Always allow to pass options directly to underlying components to increase your atom flexibility and reusage level.

## Contribution

Feel free to submit an issue to the project, and pull-requests are very welcome.

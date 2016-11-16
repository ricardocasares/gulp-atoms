const gulp = require('./index')(require('gulp'), {
  'sass:custom': {
    dest: 'custom/'
  },
  saspCustom: {
    dest: 'super/'
  }
})

gulp.task('watch', 'Watcher', ['pug:watch', 'sass:watch'])

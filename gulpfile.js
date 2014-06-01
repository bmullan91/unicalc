var gulp       = require('gulp'), 
    browserify = require('gulp-browserify');

gulp.task('browserify', function() {
  // Single entry point to browserify
  gulp.src('./js/main.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./build'));

  gulp.src('./test/tests.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./build'));
});

gulp.task('default', ['browserify']);
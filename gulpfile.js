var gulp = require('gulp');
var browserify = require('gulp-browserify');

// Basic usage
gulp.task('browserify', function() {
  // Single entry point to browserify
  gulp.src('./main.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./build'))
});

gulp.task('default', ['browserify']);
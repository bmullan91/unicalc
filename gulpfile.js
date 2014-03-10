var gulp       = require('gulp'), 
    browserify = require('gulp-browserify');

gulp.task('browserify', function() {
  // Single entry point to browserify
  gulp.src('./main.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./build'));
});

gulp.task('default', ['browserify']);
var gulp       = require('gulp'),
    clean      = require('gulp-clean'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'), 
    minifyCSS  = require('gulp-minify-css'),
    browserify = require('gulp-browserify');



gulp.task('clean', function() {
  return gulp.src('./dist', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('move', ['clean'], function () {
  gulp.src('./css/font/**')
    .pipe(gulp.dest('./dist/font'));
});

gulp.task('minify-css', ['clean'], function() {
  gulp.src('./css/*.css')
    .pipe(concat('min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('browserify-uglify', ['clean'], function() {
  // Single entry point to browserify
  gulp.src('./js/main.js')
      .pipe(browserify({}))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));

  gulp.src('./test/tests.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('browserify', ['clean'], function() {
  // Single entry point to browserify
  gulp.src('./js/main.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./dist/'));

  gulp.src('./test/tests.js')
      .pipe(browserify({}))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['clean', 'move', 'browserify-uglify', 'minify-css']);

gulp.task('debug', ['clean', 'move', 'browserify', 'minify-css'])
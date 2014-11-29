var gulp = require('gulp');
var del  = require('del');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {

  return gulp.src('public/_sass/material.scss')
    .pipe($.sass({
      style: 'nested'
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe($.rename('styles.css'))
    .pipe(gulp.dest('public/'));

});

gulp.task('scripts', function() {

  return gulp.src([
      'public/_js/jquery.min.js',
      'public/_js/**/*.js'
    ])
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest('public/'));

});

gulp.task('clean', function(cb) {

  return del([
    'public/styles.css',
    'public/scripts.js'
    ], cb);

});

gulp.task('build', ['styles','scripts']);

gulp.task('default', ['clean'], function() {

  gulp.start('build');

});

gulp.task('watch', function() {

  gulp.watch('public/_sass/**/*.scss', ['styles']);
  gulp.watch('public/_js/**/*.js', ['scripts']);

});





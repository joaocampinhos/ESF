var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {

  return gulp.src('public/_sass/styles.scss')
    .pipe($.sass({
      style: 'nested'
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('public/'));

});

gulp.task('scripts', function() {

});

gulp.task('clean', function() {

});

gulp.task('build', ['styles','scripts']);

gulp.task('default', ['clean'], function() {

  gulp.start('build');

});

gulp.task('watch', function() {

  gulp.watch('public/_sass/**/*.scss', ['styles']);
  gulp.watch('public/_js/**/*.js', ['scripts']);

});





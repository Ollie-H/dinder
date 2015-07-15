var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-minify-css');
var concat      = require('gulp-concat');
var connect     = require('gulp-connect');
var livereload = require('gulp-livereload');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('styles', function () {
    return sass('./public/sass/styles.scss') 
      .pipe(autoprefixer({
           browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
           cascade:  true
       }))
      .pipe(concat('styles.css'))
      .pipe(minifyCSS({advanced: false}))
      .pipe(gulp.dest('./public/css/'));
});

gulp.task('scripts', function() {
    // Single entry point to browserify 
    return browserify('./public/js/app.js')  
      .transform(reactify)
      .bundle()
      .pipe(source('app.min.js'))
      .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', function () {
    gulp.watch(['./public/sass/**/*.scss', './public/sass/*.scss'], ['styles']);
    gulp.watch(['./public/js/*.js', './public/js/**/*.js', './public/js/**/*.jsx', '!./public/js/*.min.js', '!js/**/*.min.js'], ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'watch']);
'use strict';

var gulp = require('gulp');

//sass watch
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var path = require('path');

//w3c-css
var validate = require('gulp-w3c-css');
var srcPath = path.join(__dirname,'./assets/css/*.css');
var gutil = require('gulp-util');

//htmlhint
var htmlhint = require("gulp-htmlhint");

//babel
var babel = require('gulp-babel');

//beautify
var beautify = require('gulp-jsbeautify');

//option 1- butternut
var butternut = require('gulp-butternut');

//option 2- buddyjs
var buddyjs = require('gulp-buddy.js');

//option 3- cat
var cat  = require('gulp-cat');




//sass tasks
gulp.task('sass', function() {
  return gulp.src('./assets/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css/'))
});

//based on stackoverlow example using square brackets to determine order https://stackoverflow.com/questions/22824546/how-to-run-gulp-tasks-sequentially-one-after-the-other
//w3c-css task
gulp.task('validate', ['sass'], function() {
gulp.src(srcPath)
  .pipe(validate())
  .pipe(gutil.buffer(function(err, files) {
  }))
});

gulp.task('watch', function () {
  gulp.watch('./assets/sass/*.scss', ['sass'])
});

gulp.task('default', ['sass', 'watch']);

//htmlhint
gulp.task('htmlhint', function(){
gulp.src("./*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
  });

  //babel
  gulp.task('babel', function () {
    return gulp.src('assets/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./assets/build/js/babel'));
});

//beautify
gulp.task('beautify', ['babel'], function() {
  gulp.src('.assets/build/js/babel/*.js')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./assets/build/js/beautify'))
});

//butternut- option 1
gulp.task('butternut', ['babel', 'beautify'], function (cb) {
    return gulp.src('.assets/js/*.js')
        .pipe(butternut({check: false}))
        .pipe(gulp.dest('./assets/build/js/butternut'));
});

//buddyjs- option 2
gulp.task('buddyjs', ['babel', 'beautify', 'butternut'],function () {
  return gulp.src('.assets/js/*.js')
    .pipe(buddyjs({
      disableIgnore: true,
      reporter: 'detailed'
    }));
});

//cat- option 3
gulp.task('cat', function() {
    return gulp.src('.assets/README.md')
        .pipe(cat());
});

//Individual tasks for js, css, html
gulp.task('js', ['babel', 'beautify', 'butternut', 'buddyjs']);
gulp.task('css', ['sass', 'validate']);
gulp.task('html', ['htmlhint']);

'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// compress js file
gulp.task('js', function(){

    browserify('./src/js/main.js', {debug: true})
        .transform(babelify.configure({
            presets: ['react', 'es2015']
        }))
        .transform('browserify-shim')
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('js:watch', function(){
    gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('sass', function(){
    gulp.src('./src/style/main.scss')
        .pipe(
            sass({outputStyle: 'compressed'})
            .on('error', sass.logError)
        )
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function(){
    gulp.watch('./src/style/*.scss', ['sass']);
});

// default task
gulp.task('default', ['sass:watch', 'js:watch']);

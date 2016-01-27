(function () {
    'use strict';

    var gulp = require('gulp'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        sass = require('gulp-sass'),
        browserSync = require('browser-sync'),
        rimraf = require('gulp-rimraf');

    function browserSyncInit(baseDir) {
        var server = {
            baseDir: './'
        };

        browserSync.instance = browserSync.init({
            server: server,
            open: true
        });
    }

    gulp.task('js', function () {
        gulp.src(['./src/**/*.js'])
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest('./dist'))
            .pipe(uglify())
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest('./dist'));
    });

    gulp.task('sass', function () {
        gulp.src('./demo/material/scss/angular-data-grid.material.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./demo/material/css/'));
        gulp.src('./demo/bootstrap/scss/angular-data-grid.bootstrap.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./demo/bootstrap/css/'));
        gulp.src('./demo/100k/scss/angular-data-grid.bootstrap.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./demo/100k/css/'));
    });

    gulp.task('build', ['js', 'sass']);

    gulp.task('watch', ['build'], function () {

        gulp.watch(['./src/**/*.js'], function (event) {
            gulp.start('js');
            browserSync.reload(event.path);
        });

        gulp.watch(['./**/*.scss'], function (event) {
            gulp.start('sass');
            browserSync.reload(event.path);
        });
    });

    gulp.task('clean', function () {
        return gulp.src(['demo'], {read: false})
            .pipe(rimraf());
    });

    gulp.task('full-clean', ['clean'], function () {
        return gulp.src(['bower_components', 'node_modules'], {read: false})
            .pipe(rimraf());
    });

    gulp.task('serve', ['watch'], function () {
        browserSyncInit(['demo']);
    });
})();
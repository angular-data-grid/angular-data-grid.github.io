'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    rimraf = require('gulp-rimraf'),
    addStream = require('add-stream'),
    templateCache = require('gulp-angular-templatecache');

function browserSyncInit(baseDir) {
    var server = {
        baseDir: baseDir
    };

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        open: false
    });
}

gulp.task('js', function () {
    gulp.src('./src/**/*.js')
        .pipe(addStream.obj(prepareTemplates()))
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./demo/js'));

    gulp.src(['./src/**/*.js', '!./src/js/app.js'])
        .pipe(addStream.obj(prepareTemplates()))
        .pipe(concat('datagrid.js'))
        .pipe(gulp.dest('dist'))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename('datagrid.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));

});


gulp.task('sass', function () {
    gulp.src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./demo'));
});

gulp.task('html', function () {
    gulp.src(['./src/**/*.html', '!./src/js/**/*.html'])
        .pipe(gulp.dest('./demo'));
});

gulp.task('build', ['js', 'sass', 'html']);

gulp.task('watch', ['build'], function () {
    gulp.watch(['./src/**/*.html'], function (event) {
        gulp.start('html');
        browserSync.reload(event.path);
    });

    gulp.watch(['./src/**/*.js'], function (event) {
        gulp.start('js');
        browserSync.reload(event.path);
    });

    gulp.watch(['./src/**/*.scss'], function (event) {
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

function prepareTemplates() {
    return gulp.src('./src/js/**/*.html')
        .pipe(templateCache('templates.js', {module: 'dataGrid'}));
}
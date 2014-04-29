'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    ngmin = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    karma = require('gulp-karma'),
    bower = require('gulp-bower'),
    src, dist;

var pkg = require('./package.json');
var banner = [  '/**',
                ' * <%= pkg.name %> - <%= pkg.description %>',
                ' * @version v<%= pkg.version %>',
                ' * @link <%= pkg.homepage %>',
                ' * @license <%= pkg.license %>',
                ' */',
                ''].join('\n');

gulp.task('clean', function () {
    gulp.src('./dist/*.js', {read: false}).
        pipe(clean());
});

gulp.task('build', function () {
    gulp.src('./module/**/*.js')
        .pipe(concat('angular-component.js'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./dist'));
});

gulp.task('min', function () {
    gulp.src('./dist/angular-component.js')
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/angular-component.min.js'));
});

gulp.task('bower', function () {
    bower();
    gulp.src('./dist/angular-component.js')
        .pipe(gulp.dest('./test/lib/'));
});

gulp.task('karma', function () {
    return gulp.src()
        .pipe(karma({
            configFile: './test/karma.conf.js',
            action: 'run'
        }))
        .on('error', function (error) {
            throw error;
        });
});

gulp.task('release', ['clean', 'build']);

gulp.task('test', ['clean', 'build', 'bower', 'karma']);

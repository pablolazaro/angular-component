'use strict';

var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    clean  = require('gulp-clean'),
    ngmin  = require('gulp-ngmin'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header'),
    karma  = require('gulp-karma'),
    bower  = require('gulp-bower'),
    debug  = require('gulp-debug'),
    rename = require('gulp-rename'),
    config = require('./config'),
    pkg    = require('./package.json');


var banner = [  '/**',
                ' * <%= pkg.name %> - <%= pkg.description %>',
                ' * @version v<%= pkg.version %>',
                ' * @link <%= pkg.homepage %>',
                ' * @license <%= pkg.license %>',
                ' */',
                ''].join('\n');

/**
 * Task to clean distribution directory.
 */
gulp.task('clean', function () {
    return gulp.src(config.distributionFolder + '*.js', {read: false})
        .pipe(clean());
});

/**
 * Task to build component library.
 */
gulp.task('build', function () {
    gulp.src(config.sourceFolder + '**/*.js')
        .pipe(concat(config.libraryName))            // Concat all JavaScript files into one file
        .pipe(header(banner, { pkg : pkg } ))        // Add header comment to concated file
        .pipe(gulp.dest(config.distributionFolder))  // Copy file to distribution folder
        .pipe(ngmin())                               // Ngmin file to avoid conflict using UglifyJS
        .pipe(uglify())                              // Compress file using UglifyJS
        .pipe(header(banner, { pkg : pkg } ))        // Add header comment to minified file
        .pipe(rename(config.minifiedLibraryName))    // Rename minified file
        .pipe(gulp.dest(config.distributionFolder)); // Copy file to distribution folder
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

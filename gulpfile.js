'use strict';

var gulp   = require('gulp'),
    fs     = require('fs'),
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


/**
 * Task to clean distribution directory.
 */
gulp.task('clean', function () {
    return gulp.src(config.distributionFolder + '*.js', {read: false})
        .pipe(clean());                                                                                         // Clean distribution directory
});

/**
 * Task to build component library.
 */
gulp.task('build', ['clean'], function () {
    return gulp.src(config.sourceFolder + '**/*.js')
        .pipe(concat(config.libraryName))                                                                       // Concat all JavaScript files into one file
        .pipe(header(fs.readFileSync(config.headerFileName, config.headerCodification), { pkg : pkg } ))        // Add header comment to concated file
        .pipe(gulp.dest(config.distributionFolder))                                                             // Copy file to distribution folder
});

gulp.task('compress', ['build'], function() {
    return gulp.src(config.distributionFolder + config.libraryName)
        .pipe(ngmin())                                                                                          // Ngmin file to avoid conflict using UglifyJS
        .pipe(uglify())                                                                                         // Compress file using UglifyJS
        .pipe(header(fs.readFileSync(config.headerFileName, config.headerCodification), { pkg : pkg } ))        // Add header comment to minified file
        .pipe(rename(config.minifiedLibraryName))                                                               // Rename minified file
        .pipe(gulp.dest(config.distributionFolder));                                                            // Copy file to distribution folder
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

gulp.task('release', ['compress']);

gulp.task('test', ['clean', 'build', 'bower', 'karma']);

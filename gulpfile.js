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
    istanbul = require('gulp-istanbul'),
    log    = require('gulp-util').log,
    config = require('./gulp-config.json'),
    pkg    = require('./package.json');


gulp.task('clean', function () {
    log('Cleaning distribution folder...');
    return gulp.src(config.distributionFolder + '*.js', {read: false})
        .pipe(clean());                                                                                         
});

gulp.task('build', ['clean'], function () {
    log('Building library...')
    return gulp.src(config.sourceFolder + '**/*.js')
        .pipe(concat(config.libraryName))                                                                       
        .pipe(header(fs.readFileSync(config.headerFileName, config.headerCodification), { pkg : pkg } ))        
        .pipe(gulp.dest(config.distributionFolder))                                                             
});

gulp.task('compress', ['build'], function() {
    log('Compressing library...')
    return gulp.src(config.distributionFolder + config.libraryName)
        .pipe(ngmin())                                                                                          
        .pipe(uglify())                                                                                         
        .pipe(header(fs.readFileSync(config.headerFileName, config.headerCodification), { pkg : pkg } ))        
        .pipe(rename(config.minifiedLibraryName))                                                               
        .pipe(gulp.dest(config.distributionFolder));                                                            
});

gulp.task('bower', function () {
    return bower();
});


gulp.task('karma', function () {
    return gulp.src(config.testFiles)
        .pipe(istanbul())
        .on('end', function () {
            gulp.src(config.testFiles)
                .pipe(karma({
                    configFile: './test/karma.conf.js',
                    action: 'run'
                }))
                .pipe(istanbul.writeReports('./coverage'));
        });
});

gulp.task('release', ['compress']);

gulp.task('test', ['build', 'karma']);

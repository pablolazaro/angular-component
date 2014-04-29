module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
          'lib/angular/angular.js',
          'lib/angular-mocks/angular-mocks.js',
          'lib/angular-component.js',
          'spec/**/*.js'
        ],
        port: 8080,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Firefox'],
        singleRun: false
    });
};

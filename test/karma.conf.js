module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        preprocessors: {
          '../dist/angular-component.js': 'coverage'
        },
        reporters: ['coverage'],
        port: 8080,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Firefox'],
        singleRun: false
    });
};

// Karma configuration
// Generated on Tue Nov 10 2015 22:00:20 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    plugins: [
      'karma-phantomjs-shim',
      'karma-mocha',
      'karma-jspm',
      'karma-spec-reporter',
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-ng-html2js-preprocessor',
      'karma-jquery-chai',
      'karma-chai-sinon',
      'karma-chai-as-promised',
    ],


    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'chai-sinon',
      'jquery-chai',
      'chai-as-promised',
      'chai',
      'jspm',
      'mocha',
      'phantomjs-shim',
    ],


    // list of files / patterns to load in the browser
    files: [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,


    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,


    jspm: {
      loadFiles: ['test/**/*.spec.js'],
      serveFiles: ['src/**/*.js'],
    },


    specReporter: {
      suppressSkipped: true,
    },


    client: {
      captureConsole: false,
    },

  });
};

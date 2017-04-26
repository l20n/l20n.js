const { TRAVIS } = process.env;

module.exports = function(config) {
  const conf = {
    basePath: '..',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/intl-pluralrules/polyfill.js',
      'dist/testing/*.js',
      'test/*_test.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox'],
    singleRun: true,
    concurrency: Infinity
  };

  if (TRAVIS) {
    conf.browsers = ['Firefox'];
  }

  config.set(conf);
};

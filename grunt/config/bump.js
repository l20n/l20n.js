'use strict';

module.exports = {
  options: {
    files: ['package.json', 'bower.json'],
    commit: true,
    commitMessage: 'Release v%VERSION%',
    commitFiles: ['package.json', 'bower.json', 'dist'],
    createTag: true,
    tagName: 'v%VERSION%',
    tagMessage: 'Version %VERSION%',
    push: false,
    pushTo: 'upstream',
  }
};

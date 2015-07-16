'use strict';

module.exports = {
  gaia: {
    files: [
      {
        expand: true,
        cwd: 'dist/web',
        src: 'l10n.js',
        dest: 'dist/gaia/shared/js/'
      },
      {
        expand: true,
        cwd: 'tests/',
        src: '**',
        dest: 'dist/gaia/apps/sharedtest/test/unit/l10n/'
      }
    ]
  }
};

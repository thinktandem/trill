'use strict';

/**
 * This file/module contains helpful copy and clean tasks.
 */

module.exports = function(common) {

  // Define cli pkg name
  var cliPkgName = 'trill-' + common.trill.pkgSuffix;

  return {

    // Our copy tasks
    copy: {
      cli: {
        build: {
          src: common.files.build,
          dest: 'build/'
        },
        dist: {
          src: 'build/' + cliPkgName,
          dest: 'dist/' + cliPkgName,
          options: {
            mode: true
          }
        }
      }
    },

    // Our clean tasks
    clean: {
      cli: {
        build: ['build'],
        dist: ['dist']
      }
    }

  };

};

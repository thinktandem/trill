'use strict';

module.exports = function(grunt) {

  // loads all grunt-* tasks based on package.json definitions
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  // Load in common information we can use across tasks
  var common = require('./tasks/common.js');

  // Load in delegated responsibilities because cleanliness => godliness
  var fs = require('./tasks/fs.js')(common);
  var shell = require('./tasks/shell.js')(common);
  var tests = require('./tasks/tests.js')(common);
  var util = require('./tasks/util.js')(common);

  // Our Grut config object
  var config = {

    // Linting, standards and styles tasks
    jshint: tests.jshint,
    jscs: tests.jscs,

    // Mocha tests
    mochacli: tests.unit,

    // Copying tasks
    copy: {
      cliBuild: fs.copy.cli.build,
      cliDist: fs.copy.cli.dist
    },

    // Copying tasks
    clean: {
      cliBuild: fs.clean.cli.build,
      cliDist: fs.clean.cli.dist
    },

    // Shell tasks
    shell: {
      cliPkg: shell.cliPkgTask()
    },

    // Utility tasks
    bump: util.bump

  };

  // Load in all our task config
  grunt.initConfig(config);

  // Check Linting, standards and styles
  grunt.registerTask('test:code', [
    'jshint',
    'jscs'
  ]);

  // Unit tests
  grunt.registerTask('test:unit', [
    'mochacli'
  ]);

  // All tests
  grunt.registerTask('test', [
    'test:code',
    'test:unit'
  ]);

  // Pkg the CLI binary
  grunt.registerTask('pkg', [
    'clean:cliBuild',
    'clean:cliDist',
    'copy:cliBuild',
    'shell:cliPkg',
    'copy:cliDist'
  ]);

  // Bump our minor version
  grunt.registerTask('bigrelease', [
    'bump:minor'
  ]);

  // Bump our patch version
  grunt.registerTask('release', [
    'bump:patch'
  ]);

  // Do a prerelease version
  grunt.registerTask('prerelease', [
    'bump:prerelease'
  ]);

};

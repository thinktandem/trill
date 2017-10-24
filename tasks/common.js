'use strict';

/**
 * @file
 * This file/module contains common things needed by many tasks.
 */

// Grab needed dataz
var pkg = require('./../package.json');

// System info
var system = {
  platform: (process.platform !== 'darwin') ? process.platform : 'osx'
};

// Lando info
var version = pkg.version;
var pkgType = ['v' + version].join('-');
var pkgExt = (system.platform === 'win32') ? '.exe' : '';
var pkgSuffix = pkgType + pkgExt;

// All js files
var jsFiles = [
  'Gruntfile.js',
  'bin/**/*.js',
  'cmds/**/*.js',
  'lib/**/*.js',
  'modules/**/*.js',
  'plugins/**/*.js',
  'tasks/**/*.js',
  'test/**/*.js'
];

// All test files
var testJsFiles = [
  'test/**/*.js'
];

// Build assets
var buildFiles = [
  'bin/trill.js',
  'lib/**',
  'plugins/**',
  '*.json',
  'config.yml',
  'encloseConfig.js'
];

// Return our objects
module.exports = {
  system: system,
  trill: {
    version: version,
    pkgType: pkgType,
    pkgExt: pkgExt,
    pkgSuffix: pkgSuffix
  },
  files: {
    build: buildFiles,
    js: jsFiles,
    jsTest: testJsFiles
  }
};

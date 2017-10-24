'use strict';

/**
 * This file/module contains all our shell based Grunt tasks
 */

// Find the NW path

module.exports = function(common) {

  // Node modules
  var path = require('path');

  // Get the platform
  var platform = common.system.platform;

  /*
   * Helper function to do the correct npm install
   */
  var npmInstallCmd = function() {

    // Return the command as a string
    return 'npm install --production';

  };

  /*
   * Run a default bash/sh/cmd script
   */
  var scriptTask = function(cmd) {

    // "Constants"
    var shellOpts = {execOptions: {maxBuffer: 20 * 1024 * 1024}};

    // Return our shell task
    return {
      options: shellOpts,
      command: cmd
    };

  };

  /*
   * Constructs the CLI PKG task
   */
  var cliPkgTask = function() {

    // Path to the pkg command
    var binDir = path.resolve(__dirname, '..', 'node_modules', 'pkg');
    var pkg = path.join(binDir, 'lib-es5', 'bin.js');

    // Get target info
    var node = 'node8';
    var os = process.platform;
    var arch = 'x64';

    // Rename the OS because i guess we want to be different than process.platform?
    if (process.platform === 'darwin') {
      os = 'macos';
    }
    else if (process.platform === 'win32') {
      os = 'win';
    }

    // Exec options
    var pkgName = 'trill-' + common.trill.pkgSuffix;
    var configFile = path.join('package.json');
    var entrypoint = path.join('bin', 'trill.js');
    var target = [node, os, arch].join('-');
    var shellOpts = {
      execOptions: {
        maxBuffer: 20 * 1024 * 1024,
        cwd: 'build'
      }
    };

    // Package command
    var pkgCmd = [
      'node',
      pkg,
      '--targets ' + target,
      '--config ' + configFile,
      '--output ' + pkgName,
      entrypoint
    ];

    // Start to build the command
    var cmd = [];
    cmd.push(npmInstallCmd());
    cmd.push(pkgCmd.join(' '));

    // Add executable perms on POSIX
    if (platform !== 'win32') {
      cmd.push('chmod +x ' + pkgName);
      cmd.push('sleep 2');
    }

    // Return the CLI build task
    return {
      options: shellOpts,
      command: cmd.join(' && ')
    };

  };

  // Return our things
  return {
    cliPkgTask: cliPkgTask,
    scriptTask: scriptTask
  };

};

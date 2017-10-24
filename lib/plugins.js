/**
 * Contains functions to help find and load plugins.
 *
 * @since 1.0.0
 * @module plugins
 * @example
 *
 * // Get the plugins from the global config and try to load them
 * return trill.config.plugins
 *
 * // Load each plugin
 * .map(function(plugin) {
 *   return trill.plugins.load(plugin);
 * });
 *
 */

'use strict';

// Modules
var _ = require('./node')._;
var config = require('./config');
var fs = require('./node').fs;
var log = require('./logger');
var path = require('path');
var Promise = require('./promise');

/*
 * Helper function to find plugin location
 */
var findPlugin = function(plugin, dirs) {

  // If dirs is not an array lets make it into one
  if (typeof dirs === 'string') {
    dirs = [dirs];
  }

  // List of default system dirs that we want to check for plugins
  var defaultDirs = [
    config.srcRoot,
    config.sysConfRoot,
    config.userConfRoot
  ];

  // Set the search dirs
  var searchBaseDirs = (dirs) ? defaultDirs.concat(dirs) : defaultDirs;

  // Each dir could have any of these sub dirs.
  var subDirs = [
    'node_modules',
    'plugins'
  ];

  // Helper function that lodash should be ashamed for not having. :P
  var flattenMap = function(elts, iterator) {
    return _(elts).chain().map(iterator).flatten().value();
  };

  // Map dirs to full list of paths.
  var searchPaths = flattenMap(searchBaseDirs, function(dir) {
    return _.map(subDirs, function(subDir) {
      return path.join(dir, subDir, plugin, 'index.js');
    });
  });

  // Log the search location
  log.debug('Searching for %s plugin in %j', plugin, searchPaths);

  // Filter paths by existance.
  return Promise.filter(searchPaths, fs.existsSync).all()

  // Grabs the last path so that we load things from SRC -> SYS -> USER -> OTHER
  .then(function(plugins) {

    // Get the correct path
    var pluginPath = _.last(plugins);

    // If we have a path lets cache it and return it
    if (pluginPath) {
      return pluginPath;
    }

  });

};

/**
 * Loads a plugin.
 *
 * See below for the default directories that are scanned. For each directory
 * scanned plugins can live in either the `plugins` or `node_modules`
 * subdirectories
 *
 * @since 1.0.0
 * @param {String} plugin - The name of the plugin
 * @param {Array} [dirs=[config.srcRoot, config.sysConfRoot, config.userConfRoot]] - Additional directories to scan for the plugin.
 * @returns {Promise} A Promise.
 * @example
 *
 * // Load the plugin called 'shield-generator' and additionally scan `/tmp` for the plugin
 * return trill.plugins.load('shield-generator', ['/tmp']);
 *
 */
exports.load = function(plugin, dirs) {

  // Find our module path
  return findPlugin(plugin, dirs)

  // Load the plugin if we have a path
  .then(function(pluginPath) {

    // If we couldn't find a plugin then warn the user
    if (!pluginPath) {
      log.warn('Could not find plugin %s', plugin);
    }

    // Try to load the plugin
    else {

      // Kick off the chain and try to require
      return Promise.try(function() {
        var trill = require('./trill')(config);
        return require(pluginPath)(trill);
      })

      // If success report that and cache the path
      .then(function() {
        log.verbose('Plugin %s loaded from %s', plugin, pluginPath);
      })

      // Catch any load failurs
      .catch(function(err) {
        throw new Error(pluginPath, err);
      });

    }

  });

};

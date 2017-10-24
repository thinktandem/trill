/**
 * Contains the main bootstrap function.
 *
 * @since 1.0.0
 * @module bootstrap
 * @example
 *
 * // Get the bootstrap function
 * var bootstrap = require('./../lib/bootstrap.js');
 *
 * // Initialize trill in CLI mode
 * bootstrap({mode: 'cli'})
 *
 * // Initialize CLI
 * .tap(function(trill) {
 *   return trill.cli.init(trill);
 * })
 */

'use strict';

// Modules
var _ = require('./node')._;
var config = require('./config');
var SILLY_TEXT = 'It\'s not particularly silly, is it? I mean, the right leg' +
  ' isn\'t silly at all and the left leg merely does a forward aerial half' +
  ' turn every alternate step.';

/**
 * The main bootstrap function.
 *
 * This will:
 *
 *   1. Instantiate the trill object.
 *   2. Emit bootstrap events
 *   3. Initialize plugins
 *
 * @since 1.0.0
 * @name bootstrap
 * @static
 * @fires pre-bootstrap
 * @fires post-bootstrap
 * @param {Object} opts - Options to tweak the bootstrap
 * @param {String} opts.mode - The mode to run the bootstrap with
 * @returns {Object} An initialized trill object
 * @example
 *
 * // Get the bootstrap function
 * var bootstrap = require('./../lib/bootstrap.js');
 *
 * // Initialize trill in CLI mode
 * bootstrap({mode: 'cli'})
 *
 * // Initialize CLI
 * .tap(function(trill) {
 *   return trill.cli.init(trill);
 * })
 */
module.exports = _.once(function(opts) {

  // Merge in our opts to the configs
  config = _.merge(config, opts);

  // Summon trill
  var trill = require('./trill')(config);

  // Log that we've begun
  trill.log.info('Bootstrap starting...');
  trill.log.debug('Boostrapping with', trill.config);
  trill.log.silly(SILLY_TEXT);

  /**
   * Event that allows other things to augment the trill global config.
   *
   * This is useful so plugins can add additional config settings to the global
   * config.
   *
   * @since 1.0.0
   * @event module:bootstrap.event:pre-bootstrap
   * @property {Object} config The global trill config
   * @example
   *
   * // Add engine settings to the config
   * trill.events.on('pre-bootstrap', function(config) {
   *
   *   // Get the docker config
   *   var engineConfig = daemon.getEngineConfig();
   *
   *   // Add engine host to the config
   *   config.engineHost = engineConfig.host;
   *
   * });
   */
  return trill.events.emit('pre-bootstrap', trill.config)

  // Return our plugins so we can init them
  .then(function() {
    trill.log.verbose('Trying to load plugins', trill.config.plugins);
    return trill.config.plugins;
  })

  // Init the plugins
  .map(function(plugin) {
    return trill.plugins.load(plugin);
  })

  /**
   * Event that allows other things to augment the trill object.
   *
   * This is useful so plugins can add additional modules to trill before
   * the bootstrap is completed.
   *
   * @since 1.0.0
   * @event module:bootstrap.event:post-bootstrap
   * @property {Object} trill The trill object
   * @example
   *
   * // Add the services module to trill
   * trill.events.on('post-bootstrap', function(trill) {
   *   trill.services = require('./services')(trill);
   * });
   */
  .then(function() {
    trill.log.info('Core plugins loaded');
    return trill.events.emit('post-bootstrap', trill);
  })

  // Return a fully initialized trill
  .then(function() {
    trill.log.info('Bootstrap completed.');
    return trill;
  });

});

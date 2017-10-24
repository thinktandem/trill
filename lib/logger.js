/**
 * Contains logging functions built from global config options.
 *
 * Logged entries are printed to the console and to `trill.log` and `error.log`
 * in `$HOME/.trill/logs`. The verbosity of these logs is determined by the
 * trill global config.
 *
 * @since 1.0.0
 * @module log
 * @example
 *
 * // Log an error message
 * trill.log.error('This is an err with details %j', err);
 *
 * // Log a silly message
 * trill.log.silly('This is probably too much logging!');
 *
 * // Log an info message
 * trill.log.info('Loaded up the %s app', appName);
 */

'use strict';

// Modules
var _ = require('./node')._;
var config = require('./config');
var fs = require('./node').fs;
var path = require('path');
var tasks = require('./tasks');
var winston = require('winston');

/*
 * Log levels
 */
var logLevels = {
  '0': 'error',
  '1': 'warn',
  '2': 'info',
  '3': 'verbose',
  '4': 'debug',
  '5': 'silly'
};

/*
 * Get log level based on value
 */
var getLogLevel = function(value) {
  return _.findKey(logLevels, function(level) {
    return value === level;
  });
};

/*
 * Get our log level
 */
var getLogLevelConsole = function() {

  // If we are in the GUI then assume the higest level here
  if (config.mode === 'gui') {
    return 'debug';
  }

  // Otherwise get the log level from the args
  var cliLevel = tasks.largv.verbose + 1 || 0;

  // Get the log level from the config
  var confLevel = getLogLevel(config.logLevelConsole) || 0;

  // Get the max log level between the two
  var maxLog = _.max([cliLevel, confLevel]);

  // Use MAX cli or conf or warn by default
  return logLevels[maxLog] || 'warn';

};

/**
 * Logs an error message.
 *
 * @since 1.0.0
 * @name error
 * @static
 * @kind method
 * @param {String} msg - A string that will be passed into nodes core `utils.format()`
 * @param {...Any} [values] - Values to be passed `utils.format()`
 * @example
 *
 * // Log an error message
 * trill.log.error('This is an err with details %j', err);
 */
/**
 * Logs a warning message.
 *
 * @since 1.0.0
 * @name warn
 * @static
 * @kind method
 * @param {String} msg - A string that will be passed into nodes core `utils.format()`
 * @param {...Any} [values] - Values to be passed `utils.format()`
 * @example
 *
 * // Log a warning message
 * trill.log.warning('Something is up with app %s in directory %s', appName, dir);
 */
/**
 * Logs an info message.
 *
 * @since 1.0.0
 * @name info
 * @static
 * @kind method
 * @param {String} msg - A string that will be passed into nodes core `utils.format()`
 * @param {...Any} [values] - Values to be passed `utils.format()`
 * @example
 *
 * // Log an info message
 * trill.log.info('It is happening!');
 */
/**
 * Logs a verbose message.
 *
 * @since 1.0.0
 * @name verbose
 * @static
 * @kind method
 * @param {String} msg - A string that will be passed into nodes core `utils.format()`
 * @param {...Any} [values] - Values to be passed `utils.format()`
 * @example
 *
 * // Log a verbose message
 * trill.log.verbose('Config file %j loaded from %d', config, directory);
 */
/**
 * Logs a debug message.
 *
 * @since 1.0.0
 * @name debug
 * @static
 * @kind method
 * @param {String} msg - A string that will be passed into nodes core `utils.format()`
 * @param {...Any} [values] - Values to be passed `utils.format()`
 * @example
 *
 * // Log a debug message
 * trill.log.debug('All details about docker inspect %j', massiveObject);
 */
/**
 * Logs a silly message.
 *
 * @since 1.0.0
 * @name silly
 * @static
 * @kind method
 * @param {String} msg - A string that will be passed into nodes core `utils.format()`
 * @param {...Any} [values] - Values to be passed `utils.format()`
 * @example
 *
 * // Log a silly message
 * trill.log.silly('All details about all the things', unreasonablySizedObject);
 *
 * // Log a silly message
 * trill.log.silly('If you are seeing this you have delved too greedily and too deep and likely have awoken something.');
 */
var log = function() {

  // Get the log root and create if needed
  var logRoot = path.join(config.userConfRoot, 'logs');
  fs.mkdirpSync(logRoot);

  // Build the logger
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: getLogLevelConsole(),
        colorize: true
      }),
      new winston.transports.File({
        name: 'error-file',
        level: 'warn',
        maxSize: 12500000,
        maxFiles: 2,
        filename: path.join(logRoot, 'error.log')
      }),
      new winston.transports.File({
        name: 'log-file',
        level: config.logLevel,
        maxSize: 25000000,
        maxFiles: 3,
        filename: path.join(logRoot, 'trill.log'),
      })
    ],
    exitOnError: true
  });

  // Return the logger
  return logger;

};

/*
 * Return the logger
 */
module.exports = log();

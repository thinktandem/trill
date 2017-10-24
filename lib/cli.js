/**
 * Contains methods to help initialize and display the CLI
 *
 * @since 1.0.0
 * @module cli
 * @example
 *
 * // Initialize CLI
 * return trill.cli.init(trill);
 */

'use strict';

// Modules
var _ = require('./node')._;
var chalk = require('./node').chalk;
var os = require('os');
var path = require('path');
var Table = require('cli-table');

// Yargonaut must come before yargs
var yargonaut = require('yargonaut');
yargonaut.style('green').errorsStyle('red');

// Get yargs
var yargs = require('yargs');

/**
 * Returns a cheeky header that can be used after an app is started.
 *
 * @since 1.0.0
 * @returns {String} A header string we can print to the CLI
 * @example
 *
 * // Print the header to the console
 * console.log(trill.cli.startHeader());
 */
exports.startHeader = function() {

  // Collect the lines
  var lines = [];

  // Paint a picture
  lines.push('');
  lines.push(chalk.green('BOOMSHAKALAKA!!!'));
  lines.push('');
  lines.push('Your app has started up correctly.');
  lines.push('Here are some vitals:');
  lines.push('');

  // Return
  return lines.join(os.EOL);

};

/**
 * Returns a cheeky header that can be used after an app is init.
 *
 * @since 1.0.0
 * @returns {String} A header string we can print to the CLI
 * @example
 *
 * // Print the header to the console
 * console.log(trill.cli.initHeader());
 */
exports.initHeader = function() {

  // Collect the lines
  var lines = [];

  // Paint a picture
  lines.push('');
  lines.push(chalk.green('NOW WE\'RE COOKING WITH FIRE!!!'));
  lines.push('');
  lines.push('Your app has been initialized.');
  lines.push('Now try running `trill start` to get rolling.');
  lines.push('');
  lines.push('Here are some vitals:');
  lines.push('');

  // Return
  return lines.join(os.EOL);

};

/**
 * Returns a cheeky header that can be used after an app is shared
 *
 * @since 1.0.0
 * @returns {String} A header string we can print to the CLI
 * @example
 *
 * // Print the header to the console
 * console.log(trill.cli.tunnelHeader());
 */
exports.tunnelHeader = function() {

  // Collect the lines
  var lines = [];

  // Paint a picture
  lines.push('');
  lines.push(chalk.green('YOU ARE NOW SHARED WITH THE WORLD!!!'));
  lines.push('');
  lines.push('A local tunnel to your app has been established.');
  lines.push('');
  lines.push('Here is your public url:');

  // Return
  return lines.join(os.EOL);

};

/**
 * Utility function to help construct CLI displayable tables
 *
 * @since 1.0.0
 * @param {Object} [opts] - Options for how the table should be built
 * @param {String} [opts.arrayJoiner=', '] - A delimiter to be used when joining array data
 * @returns {Object} Table metadata that can be printed with toString()
 * @example
 *
 * // Grab a new cli table
 * var table = new trill.cli.Table();
 *
 * // Add data
 * table.add('NAME', app.name);
 * table.add('LOCATION', app.root);
 * table.add('SERVICES', _.keys(app.services));
 * table.add('URLS', urls, {arrayJoiner: '\n'});
 *
 * // Print the table
 * console.log(table.toString());
 */
exports.Table = function(opts) {

  // Default opts
  var tableDefaults = {
    chars: {
      'top': '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      'bottom': '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      'left': '',
      'left-mid': '',
      'mid': '',
      'mid-mid': '',
      'right': '',
      'right-mid': '',
      'middle': ''
    }
  };

  // Add a push method
  Table.prototype.add = function(key, value, opts) {

    // Set the default opts
    var addDefaults = {
      arrayJoiner: ', ',
    };

    // merge opts
    opts = _.merge(addDefaults, opts);

    // Colorize key
    key = chalk.cyan(key);

    // Do some special things for arrays
    if (_.isArray(value)) {
      value = value.join(opts.arrayJoiner);
    }

    // Do the normal push
    Table.prototype.push([key, value]);

  };

  // Return our default table
  return new Table(_.merge(tableDefaults, opts));

};

/**
 * Initializes the CLI.
 *
 * This will either print the CLI usage to the console or route the command and
 * options given by the user to the correct place.
 *
 * @since 1.0.0
 * @fires pre-cli-load
 * @param {Object} trill - An initialized trill object.
 * @example
 *
 * // Initialize the CLI
 * return trill.cli.init(trill);
 */
exports.init = function(trill) {

  // Log
  trill.log.info('Initializing cli');

  // Get global tasks
  var tasks = _.sortBy(trill.tasks.tasks, 'name');

  // Get cmd
  var cmd = '$0';

  // If we are packaged lets get something else
  if (_.has(process, 'pkg')) {
    cmd = path.basename(_.get(process, 'execPath', 'trill'));
  }

  // Define our default CLI
  yargs
    .usage('Usage: ' + cmd + ' <command> [args] [options] [-- global options]');

  /**
   * Event that allows other things to alter the tasks being loaded to the CLI.
   *
   * @since 1.0.0
   * @event module:cli.event:pre-cli-load
   * @property {Object} tasks An object of Trill tasks
   * @example
   *
   * // As a joke remove all tasks and give us a blank CLI
   * trill.events.on('pre-cli-load', function(tasks) {
   *   tasks = {};
   * });
   */
  return trill.events.emit('pre-cli-load', tasks)

  // Print our result
  .then(function() {

    // Parse any global opts for usage later
    tasks.largv = trill.tasks.parseGlobals();

    // Create epilogue for our global options
    var epilogue = [
      chalk.green('Global Options:\n'),
      '  --help, -h  Show help\n',
      '  --verbose, -v, -vv, -vvv, -vvvv  Change verbosity of output'
    ];

    // Loop through the tasks and add them to the CLI
    _.forEach(tasks, function(task) {
      trill.log.verbose('Loading cli task %s', task.name);
      yargs.command(trill.tasks.parseToYargs(task));
    });

    // Invoke help if global option is specified
    if (tasks.largv.help) {
      yargs.showHelp();
      process.exit(0);
    }

    // Finish up the yargs
    var argv = yargs
      .strict(true)
      .demandCommand(1, 'You need at least one command before moving on')
      .epilog(epilogue.join(''))
      .wrap(yargs.terminalWidth() * 0.75)
      .argv;

    // Log the CLI
    trill.log.debug('CLI args', argv);

  });

};

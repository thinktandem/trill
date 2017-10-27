/**
 * Process data
 *
 * @name process
 */

'use strict';

module.exports = function(trill) {

  // Modules
  var _ = trill.node._;

  // Default options
  var options = {
    url: {
      describe: 'URL(s) to process',
      alias: ['u'],
      array: true
    },

  };

  // Let's go through our plugins and check to see if they export any options
  _.forEach(trill.process.plugins, function(plugin) {

    // Load module
    var mod = require('./plugins/' + plugin + '.js')(trill);

    // Check if it has options
    if (_.has(mod, 'options')) {
      options = _.merge(options, mod.options);
    }

  });

  // Define our task
  return {
    command: 'process',
    describe: 'Processes URLs',
    options: options,
    run: function(options) {

      // Collect results
      var results = {};

      // Emit a process import event
      return trill.events.emit('process-import', options)

      // Validate things
      .then(function() {

        // We should have URLs at this point
        if (_.isEmpty(options.url)) {
          trill.log.error('No URLs detected! You must enter at least one!');
          trill.log.error('Run "trill process -- --help"');
          process.exit(5);
        }

        // Log
        trill.log.info('About to process %j', options.url);

        // Kick off the processing
        return options.url;

      })

      // Process each lead
      .map(function(url) {
        return trill.events.emit('process-lead', {
          url: url,
          options: options,
          results: results
        });
      })

      // Export the result
      .then(function() {
        return trill.events.emit('process-export', {
          results: results,
          options: options
        });
      })

      // @todo: probably figure out where the core export as json to stdout should live
      .then(function() {
        console.log(results);
      });

    }
  };

};

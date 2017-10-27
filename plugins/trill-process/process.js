/**
 * Process data
 *
 * @name process
 */

'use strict';

module.exports = function(trill) {

  // Modules
  var _ = trill.node._;
  var Promise = trill.Promise;

  // Default options
  var options = {
    url: {
      describe: 'URL(s) to process',
      alias: ['u'],
      array: true
    }
  };

  // Let's go through our plugins and check to see if they export any options
  _.forEach(trill.process.leadPlugins, function(plugin) {

    // Load module
    var mod = require('./leads/' + plugin + '.js')(trill);

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

      // Start a results collector
      var results = {};

      // Start with option based URLs if we have them
      var urls = options.url || [];

      // We should have URLs at this point
      if (_.isEmpty(urls)) {
        trill.log.error('No URLs detected! You must enter at least one!');
        trill.log.error('Run "trill process -- --help"');
        process.exit(5);
      }

      // Log
      trill.log.info('About to process %j', urls);

      // Kick off the processing
      return Promise.resolve(urls)

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
        console.log(results);
      });

    }
  };

};

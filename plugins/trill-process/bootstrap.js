/**
 * This bootstraps the process framework
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Add services modules to trill
  trill.events.on('post-bootstrap', 1, function(trill) {

    // Let's add file processing plugins
    trill.process = {
      file: {
        'csv': require('./file/csv.js')(trill)
      }
    };

    // Load our tasks
    trill.tasks.add('process', require('./process')(trill));

    // Let's load lead processing events
    require('./leads/ping.js')(trill);

  });

};

/**
 * This bootstraps the init framework
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Add services modules to trill
  trill.events.on('post-bootstrap', 1, function(trill) {

    // Load our tasks
    trill.tasks.add('config', require('./tasks/config')(trill));
    trill.tasks.add('version', require('./tasks/version')(trill));

  });

};

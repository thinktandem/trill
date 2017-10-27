/**
 * This bootstraps the process framework
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Module
  var _ = trill.node._;

  // Add services modules to trill
  trill.events.on('post-bootstrap', 1, function(trill) {

    // Define someplace to store our process plugins
    trill.process = {};

    // Let's load our plugins
    // We assume these live in ./plugins/PLUGINNAME.js
    trill.process.plugins = [
      'growbots',
      'ping',
      'platform'
    ];

    // Let's load lead processing plugins
    _.forEach(trill.process.plugins, function(plugin) {
      require('./plugins/' + plugin + '.js')(trill);
    });

    // Load our process task
    trill.tasks.add('process', require('./process')(trill));

  });

};

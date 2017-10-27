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

    // Let's define our file and lead processing plugins
    // We assume these live in ./files/PLUGINNAME.js and ./leads respectivel
    //trill.process.filePlugins = ['csv'];
    trill.process.leadPlugins = ['ping', 'platform'];

    // Load our process task
    trill.tasks.add('process', require('./process')(trill));

    // Let's load lead processing plugins
    _.forEach(trill.process.leadPlugins, function(plugin) {
      require('./leads/' + plugin + '.js')(trill);
    });

  });

};

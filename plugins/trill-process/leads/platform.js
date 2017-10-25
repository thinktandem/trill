/**
 * This pings the leads URLs
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Modules
  var _ = trill.node._;
  var cache = trill.cache;

  // CLI options for this functionality
  var options = {
    platform: {
      describe: 'Accept only the platforms specified',
      choices: ['drupal', 'wordpress', 'mean'],
      alias: ['p'],
      array: true
    }
  };

  // Check if we can ping the lead website
  trill.events.on('process-lead', function(data) {

    // Break up the data
    var lead = data.lead;
    var options = data.options;

    // Attempt to discover the platform of the lead if applicable
    if (_.has(lead, 'Company website') && cache.get(lead['Company website'])) {

      // Get url
      var url = lead['Company website'];

      // Log it and get it
      trill.log.info('Attempting to determine the platform of %s', url);
      var siteInfo = cache.get(url);

    }

  });

  // Export options
  return {
    options: options
  };

};

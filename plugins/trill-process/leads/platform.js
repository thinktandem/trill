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
  var Promise = trill.Promise;

  // CLI options for this functionality
  var options = {
    platform: {
      describe: 'Accept only the platforms specified',
      choices: ['drupal', 'wordpress', 'mean'],
      alias: ['p'],
      array: true
    }
  };

  /*
   * Check whether its Drupal
   */
  var checkDrupal = function(data) {

    // Scan the body for drupaly things
    var isDrupal = _.some(['not-logged-in', 'drupal-link'], function(value) {
      return _.includes(data.body, value);
    });

    // Return either drupal or false
    return (isDrupal) ? 'Drupal' : false;

  };

  /*
   * Check whether its WordPress
   */
  var checkWordPress = function(data) {
    return _.includes(data.body, 'wp-content') ? 'WordPress' : false;
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

      // Run all our checks at the same time and return the first one that works
      // @todo: we want to change this so it stops as soon as we find a positive result
      return Promise.all([
        checkWordPress(siteInfo),
        checkDrupal(siteInfo)
      ])

      // Set the platform if applicable
      .then(function(result) {

        // Reduce the result to a single platform
        var platform = _.compact(result)[0] || 'Reject';
        trill.log.verbose('%s is a %s site', url, platform);

        // Check to see if platform should be rejected if we have options to filter
        if (_.has(options, 'p') && !_.includes(options.p, platform)) {
          platform = 'Reject';
        }

        // Log and set the status
        trill.log.verbose('Setting %s platform status to %s', url, platform);
        lead['Custom field: platform'] = platform;

      });

    }

  });

  // Export options
  return {
    options: options
  };

};

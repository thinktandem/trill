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

  /*
   * Check whether its Drupal
   */
  var checkDrupal = function(data) {

    // Scan the body for drupaly things
    var isDrupal = _.some(['not-logged-in', 'drupal-link'], function(value) {
      return _.includes(data.body, value);
    });

    // Return
    return {drupal: isDrupal};

  };

  /*
   * Check whether its WordPress
   */
  var checkWordPress = function(data) {
    return {wordpress: _.includes(data.body, 'wp-content')};
  };

  /*
   * Check whether its an Angular site
   */
  var checkAngular = function(data) {

    // Scan the body for angular thingz
    var isAngular = _.some(['ng-class', 'ng-app', 'ng-click'], function(value) {
      return _.includes(data.body, value);
    });

    // Return
    return {angular: isAngular};

  };

  /*
   * Check whether its an Express site
   */
  var checkExpress = function(data) {

    // Check headers for Express.
    var isExpress = _.some(data.headers, function(value) {
      return (value === 'Express') ? true : false;
    });

    // Return
    return {express: isExpress};

  };

  /*
   * Check whether its a Laravel stack
   */
  var checkLaravel = function(data) {

    // Check for Laravel cookie.
    var isLaravel = _.reduce(data.rawHeaders, function(result, value) {
      return result ||  _.includes(value, 'laravel_session');
    }, false);

    // Return.
    return {laravel: isLaravel};

  };

  // Check if we can ping the lead website
  trill.events.on('process-lead', function(data) {

    // Break up the data
    var url = data.url;
    var results = data.results;

    // Log it and get it
    trill.log.info('Attempting to determine the platform of %s', url);

    // Get the site info
    var siteInfo = cache.get(url) || '';

    // Run all the checks
    return Promise.all([
      checkWordPress(siteInfo),
      checkDrupal(siteInfo),
      checkAngular(siteInfo),
      checkExpress(siteInfo),
      checkLaravel(siteInfo)
    ])

    // Set the platform if applicable
    .then(function(tech) {

      // Start to collect the tech
      results[url].tech = {};

      // Iterate through and set
      _.forEach(tech, function(t) {
        results[url].tech = _.merge(results[url].tech, t);
      });

      // Log
      trill.log.verbose('%s uses %s', url, results[url].tech);

    });

  });

};

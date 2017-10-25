/**
 * This pings the leads URLs
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Module
  var _ = trill.node._;
  var Promise = trill.Promise;
  var rest = trill.node.rest;

  // Check if we can ping the lead website
  trill.events.on('process-lead', 1, function(data) {

    // Break up the data
    var lead = data.lead;

    // Set the ping to false
    lead.ping = false;

    // Do the vampire
    return Promise.retry(function() {
      return new Promise(function(resolve, reject) {
        if (_.has(lead, 'Company website')) {

          // Process the URL
          var url = _.get(lead, 'Company website');
          trill.log.info('About to process %s', url);

          // Make the actual request
          rest.get(url, {timeout: 3000})

          // The status code is good
          .on('success', function(data, response) {

            // Log and set ping to true
            trill.log.debug('%s is OK!', url);
            lead.ping = true;

            // Cache the results so we can use them down the pipe
            trill.cache.set(url, {
              body: data,
              headers: response.headers,
              rawHeaders: response.rawHeaders
            });

            // Resolve
            resolve(lead);

          })

          // The status code is bad
          .on('fail', function() {
            trill.log.warn('%s is NOT OK!', url);
            reject(lead);
          })

          // The timeout is exceeded
          .on('timeout', function() {
            trill.log.warn('%s timed out!', url);
            reject(lead);
          })

          // Something else bad happened
          .on('error', reject);

        }

        // Passthrough the lead
        else {
          resolve(lead);
        }

      }, {concurrency: 10});
    });
  });

};

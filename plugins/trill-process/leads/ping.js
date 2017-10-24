/**
 * This pings the leads URLs
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Module
  var _ = trill.node._;
  var rest = trill.node.rest;

  // Check if we can ping the lead website
  trill.events.on('process-lead', 1, function(lead) {

    // Set the ping to false
    lead.ping = false;

    // Do the vampire
    return new Promise(function(resolve, reject) {
      if (_.has(lead, 'Company website')) {

        // Process the URL
        var url = _.get(lead, 'Company website');
        trill.log.info('About to process %s', url);

        // Make the actual request, lets make sure self-signed certs are OK
        rest.get(url, {timeout: 3000})

        // The status code is good
        .on('success', function() {
          trill.log.debug('%s is OK!', url);
          lead.ping = true;
          resolve(lead);
        })

        // The status code is bad
        .on('fail', function() {
          trill.log.warn('%s is NOT OK!', url);
          resolve(lead);
        })

        // The timeout is exceeded
        .on('timeout', function() {
          trill.log.warn('%s timed out!', url);
          resolve(lead);
        })

        // Something else bad happened
        .on('error', reject);

      }

      // Passthrough the lead
      else {
        resolve(lead);
      }

    }, {concurrency: 100});
  });

};

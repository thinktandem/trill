/**
 * This pings the leads URLs
 *
 * @name bootstrap
 */

'use strict';

module.exports = function(trill) {

  // Module
  var Promise = trill.Promise;
  var rest = trill.node.rest;

  // CLI options for this functionality
  var options = {
    timeout: {
      describe: 'Specify the length of the ping timeout in milliseconds',
      default: 8000,
      alias: ['t'],
      number: true
    },
    retry: {
      describe: 'Specify the amount of ping retries',
      default: 3,
      alias: ['r'],
      number: true
    },
    concurrency: {
      describe: 'Specify the ping process concurrency',
      default: 50,
      alias: ['c'],
      number: true
    }
  };

  // Check if we can ping the lead website
  trill.events.on('process-lead', 1, function(data) {

    // Break up the data
    var url = data.url;
    var options = data.options;
    var results = data.results;

    // Set a bad result to start
    results[url] = {
      ping: false
    };

    // Do the vampire
    return Promise.retry(function() {
      return new Promise(function(resolve, reject) {

        // Process the URL
        trill.log.info('About to process %s', url);

        // Make the actual request
        rest.get(url, {timeout: options.timeout})

        // The status code is good
        .on('success', function(data, response) {

          // Log and set ping to true
          trill.log.debug('%s is OK!', url);

          // Cache the data so we can use them down the pipe
          trill.cache.set(url, {
            body: data,
            headers: response.headers,
            rawHeaders: response.rawHeaders
          });

          // Set the ping to true
          results[url].ping = true;

          // Resolve
          resolve();

        })

        // The status code is bad
        .on('fail', function() {
          trill.log.warn('%s is NOT OK!', url);
          reject();
        })

        // The timeout is exceeded
        .on('timeout', function() {
          trill.log.warn('%s timed out!', url);
          reject();
        })

        // Something else bad happened
        .on('error', reject);

      }, {concurrency: options.concurrency});
    }, {max: options.retry})

    // Add a catch for retry errors
    .catch(function() {
      trill.log.error('Failed to grab %s', url);
    });

  });

  // Export options
  return {
    options: options
  };

};

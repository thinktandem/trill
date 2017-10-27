/**
 * This is the csv file to json parser
 *
 * @name csv.js
 */

'use strict';

module.exports = function(trill) {

  // Modules
  var _ = trill.node._;
  var csv =  trill.node.csv;
  var csvexport = trill.node.exportcsv;
  var fs = trill.node.fs;
  var path = require('path');
  var Promise = trill.Promise;

  // Options
  var options = {
    'growbots-export-file': {
      alias: ['gef'],
      describe: 'Growbots CSV file to export',
      string: true
    },
    'growbots-import-file': {
      alias: ['gif'],
      describe: 'Growbots CSV file to import',
      string: true
    },
    'growbots-platform': {
      describe: 'Accept only the platforms specified',
      choices: [
        'angular',
        'drupal',
        'express',
        'laravel',
        'wordpress'
      ],
      alias: ['gp'],
      array: true
    }
  };

  // Augment the list of URLs to scan
  trill.events.on('process-import', function(options) {

    // Check to see if we have a igf option set
    if (_.has(options, 'gif')) {

      // Verify that file exists
      var filename = path.join(process.cwd(), _.get(options, 'gif'));
      if (!fs.existsSync(filename)) {
        trill.log.error('%s does not exist!', filename);
        process.exit(5);
      }

      // Make sure we have at least an empty array
      options.url = options.url || [];

      // Extract relevant URLs
      return new Promise(function(resolve, reject) {

        // Collect all the growbots datazzzz
        var data = [];

        // Process the file
        csv().fromFile(filename)

        // Add to the urls and build the whole result
        .on('json', function(lead) {
          if (_.has(lead, 'Company website')) {

            // Add the URL
            options.url.push(_.get(lead, 'Company website'));

            // Add the whole record
            data.push(lead);

          }
        })

        // Reject or resolve promise
        .on('done', function(error) {
          if (error) {
            reject(error);
          }
          else {
            trill.cache.set(filename, data);
            trill.log.info('File %s processed successfully', filename);
            resolve();
          }
        });
      });

    }

  });

  // Export the results into a growbots format
  trill.events.on('process-export', function(data) {

    // Break it down
    var options = data.options;
    var results = data.results;

    // Check to see if we have a gef option set
    if (_.has(options, 'gef')) {

      // Turn stdout json off
      options.json = false;

      // Exporting requires that import file also be used
      if (!_.has(options, 'gif')) {
        trill.log.error('In order to export growbots data you must import');
        process.exit(55);
      }

      // Get the things
      var exportFile = path.join(process.cwd(), _.get(options, 'gef'));
      var importFile = path.join(process.cwd(), _.get(options, 'gif'));
      var importData = trill.cache.get(importFile);

      // Go through all the import data and add in our results
      _.forEach(importData, function(lead) {

        // Match the lead with the result
        var result = results[_.get(lead, 'Company website')];

        // Map to list of tech
        var tech = _.compact(_.map(result.tech, function(status, thing) {
          return (status) ? thing : null;
        }));

        // Check if tech needs to be filtered by the platform option
        if (_.has(options, 'gp')) {
          if (_.isEmpty(_.intersection(options.gp, tech))) {
            tech = [];
          }
        }

        // Format the tech to be pretty
        tech = _.map(tech, function(t) {

          // Do an idiot check for wordpress cray
          if (t === 'wordpress') {
            t = 'WordPress';
          }

          // Return
          return _.capitalize(t);

        });

        // Set the tech
        _.set(lead, 'Custom field: platform', tech.join(' & '));

      });

      // Export the file
      return new Promise(function(resolve, reject) {
        csvexport(importData, function(error, data) {
          if (error) {
            reject(error);
          }
          else {
            fs.outputFileSync(exportFile, data);
            trill.log.info('Data written to %s with great success', exportFile);
            resolve();
          }
        });
      });

    }

  });

   // Return things
  return {
    options: options
  };

};

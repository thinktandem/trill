/**
 * This is the csv file to json parser
 *
 * @name csv.js
 */

'use strict';

module.exports = function(trill) {

  // Modules
  var csv =  trill.node.csv;
  var csvexport = trill.node.exportcsv;
  var Promise = trill.Promise;

  /*
   * Imports a CSV file to a json object
   */
  var importer = function(filename) {

    // Spin up a lead collector
    var leads = [];

    return new Promise(function(resolve, reject) {

      // Process the file
      csv().fromFile(filename)

      // Add to the collector
      .on('json', function(lead) {
        leads.push(lead);
        trill.log.debug('Added data chunk %j to %s', lead, filename);
      })

      // Reject or resolve promise
      .on('done', function(error) {
        if (error) {
          reject(error);
        }
        else {
          trill.log.info('File %s processed successfully', filename);
          resolve(leads);
        }
      });
    });

  };

  /*
   * Exports a json object to a csv file
   */
  var exporter = function(data) {
    return new Promise(function(resolve, reject) {
      csvexport(data, function(error, csv) {
        if (error) {
          reject(error);
        }
        else {
          resolve(csv);
        }
      });
    });
  };

   // Return things
  return {
    importer: importer,
    exporter: exporter,
    urlKey: 'Company website'
  };

};

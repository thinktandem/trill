/**
 * Process data
 *
 * @name process
 */

'use strict';

module.exports = function(trill) {

  // Modules
  var _ = trill.node._;
  var fs = trill.node.fs;
  var path = require('path');

  // Define our task
  return {
    command: 'process <file>',
    describe: 'Processes the csv file',
    run: function(options) {

      // Verify that file exists
      var filename = path.join(process.cwd(), options.file);
      if (!fs.existsSync(filename)) {
        trill.log.error('%s does not exist!', options.file);
        process.exit(5);
      }

      // Verify we can process the file
      var fileExtension = _.trim(path.extname(filename), '.');
      if (!_.includes(_.keys(trill.process.file), fileExtension)) {
        trill.log.error('Cannot process files of type %s', fileExtension);
        process.exit(666);
      }

      // Log
      trill.log.info('About to process %s', filename);

      // Kick of the promise chain by delegating to the correct plugin
      return trill.process.file[fileExtension].importer(filename)

      // Process each lead
      .map(function(lead) {

        // Let's start with some default values
        lead['Custom field: platform'] = 'Reject';

        // Define a lead process event
        return trill.events.emit('process-lead', lead)

        // Resolve the lead
        .then(function() {
          return lead;
        });
      })

      // Dump the result file
      .then(function(leads) {

        // log the result
        trill.log.debug('Result %j', leads);

        // Tranform the result to the correct format
        var exThing = path.basename(filename, path.extname(filename));
        var exName = exThing + '.processed.' + fileExtension;
        var exFile = path.join(process.cwd(), exName);
        trill.log.info('About to transform the result to %s', fileExtension);
        return trill.process.file[fileExtension].exporter(leads)

        // Export the file
        .then(function(data) {
          fs.outputFileSync(exFile, data);
          trill.log.info('Data written to %s with great success!', exFile);
        });

      });

    }
  };

};

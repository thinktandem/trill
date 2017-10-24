/**
 * Command to show the version
 *
 * @name version
 */

'use strict';

module.exports = function(trill) {

  // Define our task
  return {
    command: 'version',
    describe: 'Display the trill version',
    run: function() {
      console.log('v' + trill.config.version);
    }
  };

};

/**
 * Command to print out the config
 *
 * @name config
 */

'use strict';

module.exports = function(trill) {

  // Define our task
  return {
    command: 'config',
    describe: 'Display the trill configuration',
    run: function() {
      console.log(JSON.stringify(trill.config, null, 2));
    }
  };

};

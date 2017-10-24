#!/usr/bin/env node

/**
 * Main CLI entrypoint to use the Trill libraries
 * This file is meant to be linked as a "trill" executable.
 *
 * @name trill
 */

'use strict';

// Grab stuff so we can bootstrap
var bootstrap = require('./../lib/bootstrap.js');
var errorHandler;

// Initialize Trill
bootstrap({mode: 'cli'})

// Initialize CLI
.tap(function(trill) {
  return trill.cli.init(trill);
})

// Handle uncaught errors
.tap(function(trill) {
  errorHandler = trill.error.handleError;
  process.on('uncaughtException', errorHandler);
})

// Catch errors
.catch(errorHandler);

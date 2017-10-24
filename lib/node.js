/**
 * Contains helpful node modules that can be called directly from Trill.
 *
 * These are useful so that plugins are not required to manage their own node
 * dependencies with a `package.json` file which can be annoying esp for small and lightweight
 * plugins.
 *
 * @since 1.0.0
 * @module node
 * @example
 *
 * // Get the lodash module
 * var _ = trill.node._;
 *
 * // Get the restler module
 * var restler = trill.node.restler;
 *
 */

'use strict';

/**
 * Get lodash
 *
 * @since 1.0.0
 * @example
 *
 * // Get the lodash module
 * var _ = trill.node._;
 */
exports._ = require('lodash');

/**
 * Get chalk
 *
 * @since 1.0.0
 * @example
 *
 * // Get the chalk module
 * var chalk = trill.node.chalk;
 */
exports.chalk = require('yargonaut').chalk();

/**
 * Get csv module
 *
 * @since 1.0.0
 * @example
 *
 * // Get the csv module
 * var csv = trill.node.csv;
 */
exports.csv = require('csvtojson');
exports.exportcsv = require('jsonexport');

/**
 * Get fs-extra
 *
 * @since 1.0.0
 * @example
 *
 * // Get the fs-extra module
 * var fs = trill.node.fs;
 */
exports.fs = require('fs-extra');

/**
 * Get ip utils
 *
 * @since 1.0.0
 * @example
 *
 * // Get the ip module
 * var ip = trill.node.ip;
 */
exports.ip = require('ip');

/**
 * Get object-hash
 *
 * @since 1.0.0
 * @example
 *
 * // Get the object-hash module
 * var hasher = trill.node.hasher;
 */
exports.hasher = require('object-hash');

/**
 * Get jsonfile
 *
 * @since 1.0.0
 * @example
 *
 * // Get the jsonfile module
 * var jsonfile = trill.node.jsonfile;
 */
exports.jsonfile = require('jsonfile');

/**
 * Get restler
 *
 * @since 1.0.0
 * @example
 *
 * // Get the restler module
 * var rest = trill.node.rest;
 */
exports.rest = require('restler');

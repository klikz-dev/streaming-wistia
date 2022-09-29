'use strict';

// This file contains utility functions.

/**
 * A function to make retries
 * @param {Integer} maxRetries - Maximum number of retries.
 * @param {Function} fn - The function that you want to retry.
 * @param {Object} fnOpts - The parameters that will be passed into fn.
 * @param {Function} errHandler - The error handler function to deal with the error.
 * @returns {Promise} that resolves to a response upon successful delivery or an Error.
 */
var retry = function (maxRetries, fn, fnOpts, errHandler) {
  return fn(fnOpts).catch(function(err) {
    if (maxRetries <= 1) {
      errHandler(err);
      return;
    }
    return retry(maxRetries - 1, fn, fnOpts, errHandler);
  });
}

module.exports.retry = retry;

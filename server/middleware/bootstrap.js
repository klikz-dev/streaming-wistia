'use strict';
var config = require('../config');

/**
 * This middleware exposes localization terms to the templates for use
 * within the client-side javascript.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {next step callback} next - The callback for the next route.
 */

module.exports = function(req, res, next) {
  var settings = config.getLocaleSettings(req.locale);
  res.locals.bootstrap = JSON.stringify({
    localization: res.locals.localization,
    previewTime: settings.previewTime
  });

  next();
};

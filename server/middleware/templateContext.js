'use strict';

var settings = require('../config');

/**
 * This middleware exposes localization terms to the templates for use
 * within the client-side javascript.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {next step callback} next - The callback for the next route.
 */

module.exports = function(req, res, next) {
  var config = settings.getLocaleSettings();
  res.locals.config = config;
  res.locals.pageName = '';
  res.locals.pageTitle = config.siteName;

  res.locals.metatags = {
    title: '',
    description: '',
  };

  res.locals.header = {
    url: '/'
  };

  next();
};
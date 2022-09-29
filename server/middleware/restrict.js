'use strict';

var logger = require('node-logger')(module);
var config = require('../config');

/**
 * Restrict access if not authenticated to see the page
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {next step callback} next - The callback for the next route.
 */

var restrict = function(url, req, res, next) {
  if (req.isAuthenticated()) return next();
  logger.warn('Attempt to access an unauthorized page', req.url);

  req.session.redirect = req.originalUrl;
  res.redirect(url);
};

var regularPageRestrict = function(req, res, next) {
  return restrict('/', req, res, next);
};

var detailPageRestrict = function(req, res, next) {
  if (req.isAuthenticated()){
    res.locals.loggedInPreview = false;
    res.loggedInPreview = false;
  } else {
    res.locals.loggedInPreview = true;
    res.loggedInPreview = true;
    res.locals.loginURL = config.sso.loginURL;
    req.session.redirect = req.originalUrl;
  }
  //return restrict(config.sso.loginURL, req, res, next);
  return next();
};

module.exports = {
  regularPageRestrict: regularPageRestrict,
  detailPageRestrict: detailPageRestrict
};

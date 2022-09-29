'use strict';

var logger = require('node-logger')(module);

module.exports.getTerms = function(req, res) {
  res.render('terms/main', {
    pageName: req.__('Terms Of Use'),
    isHeaderSolid: true
  });
};

module.exports.getFAQ = function(req, res) {
  res.render('faq/main', {
    pageName: req.__('FAQ'),
    isHeaderSolid: true
  });
};

module.exports.getPrivacy = function(req, res) {
  res.render('privacy/main', {
    pageName: req.__('Privacy Policy'),
    isHeaderSolid: true
  });
};

module.exports.err404 = function(req, res) {
  logger.error('404 error', req.url);

  res.status(404).render('error/main', {
    pageTitle: req.__(req.error ? req.error.pageTitle : 'Page not found'),
    heading: req.__(req.error ? req.error.heading : 'This page does not exist!'),
    errorDetail: req.__(req.error ? req.error.errorDetail : 'Page not found')
  });
};

/* jshint unused:false */
module.exports.err500 = function(err, req, res, next) {
  logger.error('500 error', err);

  res.status(500).render('error/main', {
    pageTitle: req.__('Error'),
    heading: req.__('500 Error'),
    errorDetail: err.toString()
  });
};

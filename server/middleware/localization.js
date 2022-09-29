'use strict';

var config = require('../config');
var logger = require('node-logger')(module);
var moment = require('moment');
var i18n = require('i18n');

module.exports = {
  setLocale: function(req, res, next) {
    var match = req.url.match(/^\/([a-z]{2})([\/\?].*)?$/i);
    var locale = config.localization.defaultLocale;

    // If a locale is found in the URL, apply those locale settings and
    // rewrite it out of the URL for future middlewares. This prevents
    // each route from needing to define an optional locale param as part
    // of its route definition.
    if (match && config.localization.locales.indexOf(match[1]) > -1) {
      logger.debug('Locale found in URL:', match[1]);
      locale = match[1];
      req.url = match[2] || '/';
    }

    i18n.setLocale(req, locale);
    moment.locale(locale);
    req.locale = res.locals.locale = locale;
    next();
  }
};
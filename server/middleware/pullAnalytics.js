'use strict';

var analytics = require('../lib/analytics');

module.exports = function(req, res, next) {
  analytics.get(req.locale).then(function(analyticsData) {
    req.analyticsData = analyticsData;
    next();
  }).catch(next);
};
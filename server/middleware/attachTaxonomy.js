'use strict';

var Taxonomy = require('../models/taxonomy');
var settings = require('../config');

/**
 * Creates all the category models and loads the videos
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {next step callback} next - The callback for the next route.
 */

module.exports = function attachTaxonomy(req, res, next) {
  var config = settings.getLocaleSettings(req.locale);
  const categories = config.categories;
  // return {
  //   taxonomy: {
  //     categories: categories,
  //   },
  // };
  res.locals.taxonomy = req.taxonomy = { categories: categories };

  if (req.category) {
    req.category
      .fetchVideos({
        account: req.locale,
        fetch_all: true,
        encode: true,
        analyticsData: req.analyticsData,
      })
      .then(function () {
        next();
      })
      .catch(next);
  } else {
    next();
  }
};

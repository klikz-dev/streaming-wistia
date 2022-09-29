'use strict';


var _ = require('lodash');
var logger = require('node-logger')(module);


/*
This is the category controller that loads all the videos and subcategories for a determined category.
The breadcrumb provides the path for each layer.

When using the right-side bar to browse categories, this controller page will be only intermediary and will transfer it to the details page
*/


/**
 * Category page function loads the category page selected from the breadcrumb or redirects to the details page if browsing from the right-side bar.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */

module.exports.categoryPage = function(req, res, next) {
  var category = req.category;

  /*
  If there are no subcategories, the detail page should be loaded with the
  first video in this category
  */

  if (!category || !category.hasCategories) {
    logger.debug('No subcategories exist for %s; falling through to detail page', category && category.url);
    return next();
  }

  var breadcrumb = category.getBreadcrumb();
  var carousels = category.categories.map(function(category) {

    return {
      title: category.title,
      url: category.url,
      category: category,
      lazyLoadThumbnails: true,
      videos: category.collection.videos
    };
  });

  res.render('category/main', _.merge({
    carousels: carousels
  }, breadcrumb));
};

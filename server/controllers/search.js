'use strict';

var _ = require('lodash');
var settings = require('../config');
var cmsApi = require('../lib/cmsApi');
var xss = require('xss');
var limit = 400; //Limit number of results

/**
 * Search videos with a certain tag/name. Category search is not available.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return respective video or callback to the next step in the route
 */

module.exports.searchPage = function (req, res, next) {
  var config = settings.getLocaleSettings(req.locale);
  var keyword = xss(req.query.keyword);
  if (!keyword) {
    return next();
  }
  // Originally included any: tags as part of the search
  cmsApi
    .searchVideos(keyword)
    .then(function (results) {
      console.log(results);
      // WORKAROUND: CMS API does not seem to work as expected when we have multi-terms
      // in the search request (i.e  +name:'+keyword  +tags: + tags)
      var currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;
      var sortBy = req.query.sort || 'date';

      // Sort the collection
      if (results.isSortable()) {
        results[sortBy === 'date' ? 'sortByDate' : 'sortByName']();
      }

      // Paginate the collection and set the current page
      var pagination = results.paginate(10);
      pagination.setPage(currentPage);

      // Get videos for the current page
      var videos = pagination.getVideos().map(function (video) {
        video.showDescription = true;
        return video;
      });

      res.render('search/main', {
        pageTitle: req.__('Search results for %s', keyword),
        keyword: keyword,
        videos: videos,
        pagination: _.merge(
          {
            rootUrl: req.path,
            sortBy: sortBy,
            isSortable: results.isSortable(),
            isDateActive: sortBy === 'date',
            isPopularityActive: sortBy === 'popularity',
          },
          pagination
        ),
      });
    })
    .catch(next);
};

/**
 * Auxiliary design method to show a dropdown list of videos that matches the search.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return {Object} the respective video
 */

module.exports.autocomplete = function (req, res, next) {
  var config = settings.getLocaleSettings(req.locale);
  var keyword = xss(req.query.q);
  var tags = req.taxonomy.tags;
  var playlistVideoIds = req.taxonomy.playlistVideoIds;
  if (!keyword) {
    return res.send([]);
  }
  cmsApi
    .searchVideos(
      {
        limit: config.numAutocompleteVideos,
        q: '+playable:true +name:' + keyword,
      },
      {
        encode: true,
        account: req.locale,
        tags: tags,
        playlistVideoIds: playlistVideoIds,
        analyticsData: req.analyticsData,
      }
    )
    .then(function (collection) {
      res.render('search/autocomplete', {
        layout: false,
        videos: collection.videos.map(function (video) {
          video.hideTooltip = true;
          return video;
        }),
      });
    })
    .catch(next);
};

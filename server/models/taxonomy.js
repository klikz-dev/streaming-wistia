'use strict';

var path = require('path');
var _ = require('lodash');
var logger = require('node-logger')(module);
var Category = require('./category');
var config = require('../config');
var instances = {};

/**
 * Taxonomy model
 */
function Taxonomy(locale, categories) {
  this._rawCategories = _.merge([], categories); //stored for output toJSONObject

  this.categories = categories.map(function(params) {
    return new Category(params);
  }, this);

  var getTags = function(categories) {
    var tags = [];

    categories.forEach(function(category) {
      if (category.hasCategories)
        tags = tags.concat(getTags(category.categories));
      else {
        tags = tags.concat(category.tags);
      }
    });

    return tags;
  };

  instances[locale] = this;
  this.locale = locale;
  this.tags = getTags(this.categories);
  this.playlistVideoIds = [];
  this.playlistHash = {};
}

Taxonomy.prototype = {
  constructor: Taxonomy,

  /*
   * Returns the category object corresponding to this path
   * @params {String} urlPath - a relative url path
   */
  getCategoryByPath: function(urlPath) {
    urlPath = urlPath.split('?')[0];

    var levels = _.compact(path.normalize(urlPath).split(/[\\|/]/)),
      len = levels.length,
      categories = this.categories;

    // Remove extra parts of URL if currently on a detail page
    if (levels[0] === config.videoPrefix) {
      levels = levels.slice(1, len - 2);
      len -= 3;
    }
    if(levels[0] === 'vpop') {
      levels = levels.slice(1, len - 1);
     len -= 2;
    }

    for (var i = 0; i < len; i++) {
      var cLen = categories.length;

      for (var j = 0; j < cLen; j++) {
        if (levels[i] === categories[j].slug) {
          if (i === len - 1)
            return categories[j];

          categories = categories[j].categories;
          break;
        }
      }
    }
  },

  /*
   * Recursively get the list of playlist video ids by category.
   * Returns a promise contains playlist video ids and playlist hash table.
   * @params {Object} opts - options for the cms api
   */
  getPlaylistsVideoIds: function(opts) {
    var playlistHash = this.playlistHash;
    return (function getVideoIds(categories, playlistVideoIds) {

      var videoPromises = Promise.all(categories.map(function(category) {
        if (category.hasCategories) {
          return getVideoIds(category.categories, playlistVideoIds);
        } else {
          return category.fetchPlaylistVideoIds(opts).then(function(ids) {
            ids.forEach(function(id) {
              playlistHash[id] = category.url;
            });
            return Promise.all([ids, playlistHash]);
          });
        }
      }));
      return videoPromises.then(function(videoPromiseArrays) {
        videoPromiseArrays.forEach(function(videoPromise) {
          playlistVideoIds = _.uniq(playlistVideoIds.concat(videoPromise[0]));
        });
        return Promise.all([playlistVideoIds, playlistHash]);
      });
    })(this.categories, this.playlistVideoIds);
  },

  //give it to us in a nice format!
  toJSONObject: function() {
    return {
      'locale': this.locale,
      'categories': this._rawCategories,
      'tags': this.tags
    };
  },

  toString: function() {
    return JSON.stringify(this.toJSONObject());
  }
};

/**
 * Find a category for a video
 * @static
 * @param {String} locale - locale of the video
 * @param {Video} video - video model
 * @param {Category} [category] - optional category object used to seed the search with
 * @returns {Category} the last category that matches
 */
Taxonomy.getCategoryByVideo = function(locale, video, category) {
  var matches = [];

  // Recursively loop through all the categories and build an array
  // of categories that match this video's tags
  (function getMatchingCategories(categories) {
    categories.some(function(cat) {
      if (_.intersection(video.tags, cat.tags).length > 0) {
        matches.push(cat);
        return true; // exit this loop as soon as a match is found.
      }

      // console.log('searching category', cat.title, 'tags are', cat.tags, 'for video tgas', video.tags);
      if (cat.categories) {
        getMatchingCategories(cat.categories);
      }
    });
  })(category ? [category] : instances[locale].categories);

  // logger.debug('Found', matches.length, 'matching categories for video', video.id, 'tags: ', video.tags.join(','));

  if (!matches) {
    logger.error('Category not found for video', video.name, video.id);
    return null;
  }

  return matches[matches.length - 1];
};

/**
 * Get a taxonomy instance for a locale
 * @static
 * @param {String} locale
 * @returns {Taxonomy} taxonomy instance
 */
Taxonomy.get = function(locale) {
  return instances[locale];
};

module.exports = Taxonomy;
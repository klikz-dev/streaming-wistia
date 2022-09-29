'use strict';
var _ = require('lodash');
var cmsApi = require('../lib/cmsApi');
var VideoCollection = require('./videoCollection');

var path = require('path');

/**
 * Category model
 * @param {Object} params - params loaded in from the config file (name, slug, query, subcategories, etc)
 * @param {Category} parent - if this is a subcategory of another Category, that one should be passed in as its parent
 */
function Category(params, parent) {
  this.title = params.name;
  this.parent = parent;
  this.slug = params.slug;
  this.query = params.query;
  this.hasCategories = params.categories !== undefined && params.categories.length > 0;
  this.collection = new VideoCollection();
  this.playlistVideos = [];
  this.url = '';

  // Creates URL
  var category = this;
  while (category) {
    this.url = '/' + category.slug + this.url;
    category = category.parent;
  }

  // Creates subcategories
  this.categories = (params.categories || []).map(function(subCategory) {
    return new Category(subCategory, this);
  }, this);

  // Make an array of tags based on the query for easy access
  this.tags = this.query && this.query.q ? _.uniq(this.query.q.replace('tags:', '').split(',')) : [];

  //if the tags begin and end with double quotes... remove them.
  for (var i = 0, tagLen = this.tags.length; i < tagLen; i++) {
    this.tags[i] = this.tags[i].replace(/^\"|\"$/g, '');
  }
}

Category.prototype = {
  constructor: Category,

  /*
   * Fetch all the video ids for the playlist category,
   * Return empty array if the category is not a playlist.
   */
  fetchPlaylistVideoIds: function(opts) {
    if (this.query.playlist) {
      return cmsApi.findPlaylistById(this.query.playlist, opts).then(function(collection) {
        this.playlistVideos = collection.videos.map(function(video) {
          return video.id;
        });
        return this.playlistVideos;
      }.bind(this));
    } else {
      return Promise.resolve([]);
    }
  },

  /*
   * Recursively fetches videos down the category from this category and all of its children
   */
  fetchVideos: function(opts) {
    // If the category has no subcategories, make a cmsApi call to fetch its videos
    if (!this.hasCategories) {
      if (this.query.playlist) {
        return cmsApi.findPlaylistById(this.query.playlist, opts).then(function(collection) {
          collection.setSortable(false); //do not sort the collection if it came from a playlist

          //The array of videos returned does not match the order specified in the
          //Video Cloud.  So we'll manually traverse the ordered list of ids and re-populate
          //the videos list with that order.
          try {

            //first get a list of all the videos in a JSON object for easy lookup
            var existingVideos = {};
            for (var j = 0, jLen = collection.videos.length; j < jLen; j++) {
              var id = collection.videos[j].id.toString();
              existingVideos[id] = collection.videos[j];
            }

            //now go through the list of video_ids and put the video objects in order
            var newVideos = [];
            for (var i = 0, iLen = collection.data.video_ids.length; i < iLen; i++) {
              var videoId = collection.data.video_ids[i];
              if (existingVideos[videoId]) {
                newVideos.push(existingVideos[videoId]);
              }
            }
            collection.videos = newVideos;
          } catch (e) {
            console.log('Error parsing playlist order.', e);
          }
          this.collection = collection;
          this.playlistVideos = collection.videos.map(function(video) {
            return video.id;
          });
        }.bind(this));
      } else {
        var prefix = '',
          queryPlayable;
        if (this.tags.length === 1) {
          prefix = '+';
        }

        //we need to get the regular query q data (usually tags)
        queryPlayable = {
          q: '+playable:true ' + prefix + this.query.q,
          sort: 'updated_at'
        };


        return cmsApi.searchVideos(queryPlayable, opts).then(function(collection) {
          this.collection = collection;
        }.bind(this));

      }

    }

    // If the category has subcategories, call all of it's subcategory's fetchVideos methods
    var videoPromises = Promise.all(this.categories.map(function(category) {
      return category.fetchVideos(opts);
    }));

    return videoPromises.then(function() {
      this.collection = new VideoCollection();
      this.categories.forEach(function(category) {
        this.collection.addVideos(category.collection.videos);
      }, this);
    }.bind(this));
  },

  /**
   * Returns the breadcrumb for the current category
   * @param {Boolean} fixed - determines if the fixed flag should be true/false
   */
  getBreadcrumb: function(fixed) {
    var items = [];
    var category = this;

    while (category) {
      items.splice(0, 0, {
        title: category.title,
        url: path.normalize(category.url)
      });
      category = category.parent;
    }

    // Removes url from lowest level category
    delete items[items.length - 1].url;

    return {
      breadcrumb: {
        fixed: fixed === undefined ? this.hasCategories : fixed,
        items: items
      }
    };
  }
};


module.exports = Category;
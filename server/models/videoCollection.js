'use strict';

var _ = require('lodash');
var Video = require('./video');
var VideoPagination = require('./videoPagination');

/**
 * Video Collection
 * This is a wrapper around an array of Video models
 * @constructor
 * @param {Object} resp - media API response
 * @param {Array} [tags] - the list of tags all videos must contain at least one of
 */
function VideoCollection(data, tags, playlistVideoIds, analyticsData) {
  _.extend(
    this,
    _.pick(
      data,
      'id',
      'name',
      'mediaCount',
      'created',
      'updated',
      'hashedId',
      'anonymousCanUpload',
      'anonymousCanDownload',
      'public',
      'publicId',
      'description'
    )
  );
  this.analyticsData = analyticsData || {};

  //can this collection be sorted?
  this.setSortable(true);

  var videos = !data
    ? []
    : Array.isArray(data)
    ? data
    : data.medias
    ? data.medias
    : [data];

  if (tags && tags.length > 0) {
    tags = _.flatten(
      tags.map(function (tag) {
        return tag.split(',');
      })
    );

    // Filter by tags and playlist.
    videos = videos.filter(function (video) {
      if (_.indexOf(playlistVideoIds, parseInt(video.id)) !== -1) {
        return true;
      } else {
        return _.intersection(video.tags, tags).length > 0;
      }
    });
  }

  this.videos = videos.map(function (video) {
    if (typeof analyticsData !== 'undefined') {
      video.playsTotal = analyticsData[video.id]
        ? analyticsData[video.id].video_view
        : 0;
    }
    return new Video(video);
  });
}

VideoCollection.prototype = {
  constructor: VideoCollection,

  /**
   * Returns the number of elements in this collection.
   */
  size: function () {
    return this.videos.length;
  },

  /**
   * Add videos to collection
   * @param {Array} videos - the videos to add
   */
  addVideos: function (videos) {
    this.videos = this.videos.concat(videos);
  },

  /**
   * Retrieve a video by id
   * @param {String} id - the id of the video
   * @returns {Video} - the video in the collection matching the id
   */
  getVideoById: function (id) {
    return _.findWhere(this.videos, {
      id: parseInt(id, 10),
    });
  },

  /**
   * Paginate the current array of videos
   * @param {Number} pageSize - number of results per page
   * @param {Number} pageNum - current page number
   * @returns {VideoPagination} - new VideoPagination object
   */
  paginate: function (pageSize, pageNum) {
    return new VideoPagination(this, pageSize, pageNum);
  },

  /**
   * Mark the current video as active
   * @param {Video} - video object
   */
  setActiveVideo: function (thisVideo) {
    this.videos.forEach(function (video) {
      video.setActive(thisVideo && video.id === thisVideo.id);
    });

    return this;
  },

  /**
   * Sets the user ratings for videos in this collection and returns a new list so the original collection is preserved
   * @param {Object} ratings - a map of video id's to ratings
   * @returns {Video[]} an array of videos with the user ratings set
   */
  setUserRatings: function (ratings) {
    if (Object.keys(ratings).length === 0) return this;

    var videos = this.videos.slice(0);
    for (var i = 0, len = videos.length; i < len; i++) {
      var video = videos[i];
      var rating = ratings[video.id];
      if (rating) videos[i] = video.setRating(rating);
    }

    var collection = new VideoCollection(this.props);
    collection.videos = videos;
    return collection;
  },

  sortable: true,
  /**
   * Sets the the collection's sortable flag to allow it to be sortable
   * @param {Boolean} sortable - a flag to set the sortable flag
   */
  setSortable: function (sortable) {
    this.sortable = !!sortable;
  },

  /**
   * Gets the the collection's sortable flag
   * @returns {Boolean}
   */
  isSortable: function () {
    return this.sortable;
  },

  /**
   * Sort the current collection by published date
   */
  sortByDate: function () {
    if (!this.isSortable()) {
      throw new Error('Unable to sort on non-sortable collection.');
    }
    if (this._currentSort === 'date') return;
    this._currentSort = 'date';
    this.videos.sort(function (a, b) {
      a = new Date(a.created_at);
      b = new Date(b.created_at);
      return b - a;
    });
  },

  /**
   * Sort the current collection by playsTotal
   */
  sortByViews: function () {
    var analyticsData = this.analyticsData;
    if (!this.isSortable()) {
      throw new Error('Unable to sort on non-sortable collection.');
    }
    if (this._currentSort === 'views') return;
    this._currentSort = 'views';
    this.videos.sort(function (a, b) {
      var viewsA = analyticsData[a.id] ? analyticsData[a.id].video_view : 0;
      var viewsB = analyticsData[b.id] ? analyticsData[b.id].video_view : 0;
      return viewsB - viewsA;
    });
  },

  /**
   * Filter the collection to only include videos with plays
   */
  hasPlays: function () {
    this.videos = this.videos.filter(function (video) {
      return video.playsTotal > 0;
    });

    return this;
  },
};

// Expose the collection
module.exports = VideoCollection;

'use strict';

var _ = require('lodash');
var moment = require('moment');

/**
 * Video Model
 */
function Video(props) {
  _.merge(this, props);
  this.props = _.merge({}, props);
  this.id = parseInt(this.id, 10);
  var duration = moment.duration(parseInt(this.duration, 10));
  this.lengthFormatted = moment(duration.as('milliseconds')).format('mm:ss');
  let h=duration.hours();
  if(h>0) this.lengthFormatted = ''+h+':'+this.lengthFormatted;
  this.createdAtFormatted = moment(this.created_at).format('ll');
  this.custom_fields = this.custom_fields || {};
  this.playsTotal = this.playsTotal || 0;
  this.thumbnail = this.thumbnail || '/components/video-thumb/images/defaultThumb.png';

  this.rating = this.custom_fields.rating ? parseFloat(this.custom_fields.rating.split('_')[0], 10) : -1;
  this.setRating();

  this.slug = this.name
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9\-]+/ig, '')
    .replace(/\./g, '_');
}

Video.prototype = {
  constructor: Video,

  /**
   * Sets this video's rating
   * @param {Float} rating - the rating. If not given, it will use the video's preset rating
   */
  setRating: function(rating) {
    var video;
    if (!rating)
      video = this;
    else {
      video = new Video(this.props);
      video.rating = rating;
    }

    video.ratingArr = [0, 0, 0, 0, 0];
    for (var i = 0, len = video.rating; i <= len; i++)
      video.ratingArr[i] = 1;
    if (video.rating % 1 > 0)
      video.ratingArr[Math.floor(video.rating + 1)] = 0.5;

    return video;
  },

  /**
   * Mark this video as active or inactive
   * @param {Boolean} flag - bool whether or not it should be active
   * @return {Video} - this object
   */
  setActive: function(flag) {
    this.isActiveVideo = flag;
    return this;
  }
};

module.exports = Video;

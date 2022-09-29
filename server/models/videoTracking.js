'use strict';

var _ = require('lodash');
var moment = require('moment');

function VideoTracking(props) {
  _.merge(this, props);
  this.recordedAt = moment().unix();
  this.recordedAtFormatted = moment().format('lll');
}

VideoTracking.prototype = {
  constructor: VideoTracking,
};

module.exports = VideoTracking;

'use strict';

var generaterr = require('generaterr');

module.exports = {
  VideoNotFoundError: generaterr('VideoNotFoundError'),
  CMSAPIError: generaterr('CMSAPIError')
};
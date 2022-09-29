'use strict';

var cmsApi = require('./cmsApi');
var ums = require('node-ums');
var logger = require('node-logger')(module);

/**
 * Uses the CMS API to change the rating of a video.
 *** Although the parameters are all numbers, they are passed here as strings
 * @param {String} videoId - name of the partial, like "components/foo/foo". Must be relative to config.templates.partialsDir.
 * @param {String} rating - context to render against
 * @param {String} oldRating - context to render against
 * @returns the cmsApi updated video
 */

module.exports.updateRating = function(videoId, rating, oldRating) {
  var store = cmsApi.getStore();
  if (store)
    store.flushAll();

  return cmsApi.findVideoById(videoId, {
    cache: false
  }).then(function(collection) {
    var video = collection.videos[0];
    var oldUserRating = oldRating >= 0 ? parseFloat(oldRating) : undefined,
      newUserRating = parseFloat(rating),
      currAvg = 0,
      currNum = 0,
      newAvg,
      newNum;

    if (video.custom_fields.rating) {
      var ratingInfo = video.custom_fields.rating.split('_');
      currAvg = parseFloat(ratingInfo[0]) || 0;
      currNum = parseInt(ratingInfo[1], 10) || 0;
    }

    if (oldUserRating) {
      newAvg = Math.round((currAvg * currNum - oldUserRating + newUserRating) / currNum * 2) / 2;
      newNum = currNum;
    } else {
      newAvg = Math.round((currAvg * currNum + newUserRating) / (currNum + 1) * 2) / 2;
      newNum = currNum + 1;
    }

    var params = {
      custom_fields: {
        rating: newAvg.toString() + '_' + newNum.toString()
      }
    };
    return cmsApi.updateVideo(videoId, params);
  });
};

/**
 * Rewrite each method to return collections where the videos have the user's ratings if set
 */

module.exports.init = function() {
  Object.keys(cmsApi).forEach(function(method) {
    if (['parse', 'getStore', 'updateVideo', 'getAccessToken', 'findVideoByIdWithoutRating'].indexOf(method) >= 0) {
      return;
    }

    var oldMethod = cmsApi[method];
    cmsApi[method] = function() {
      return (oldMethod.apply(null, arguments)).then(function(collection) {
        return ums.api.getUserRatings().then(function(ratings) {
          return collection.setUserRatings(ratings);
        });
      }).catch(function(err) {
        logger.error(err);
      });
    };
  });
};

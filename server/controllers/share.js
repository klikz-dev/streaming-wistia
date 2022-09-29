'use strict';

/*
The share controller decides which url to redirect, if the user is logged in, the link will redirect
the user to the detail page, otherwise, the user will stay in this page and can only watch the video
for a defined period of time.
*/

var settings = require('../config');
var cmsApi = require('../lib/cmsApi');


/**
 * Loads the shared video and present the content or redirect to detail page based on the users authentication.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */

module.exports.sharePage = function(req, res, next) {
  var successUrl = req.url.replace('/share', '');
  if (req.isAuthenticated()) {
    res.redirect(successUrl);
  } else {
    var videoId = req.params.videoId;
    var config = settings.getLocaleSettings(req.locale);

    // If we still don't have a video id, 404
    if (!videoId || isNaN(videoId)) {
      console.error('Could not find a video ID to load the detail page with');
      return next();
    }

    // This will find the video without trying to get the rating info, which requires users authentication.
    cmsApi.findVideoByIdWithoutRating(videoId, {
      account: req.locale,
      fetch_all: true,
      encode: true
    }).then(function(collection) {
      var video = collection.videos[0];

      // Note: This req.protocol is not accurate, maybe should hard code https
      var sharingURL = req.protocol + '://' + req.hostname + req.url;

      // The object that'll be rendered against the mustache
      var context = {
        metatags: {
          title: video.name,
          description: video.description
        },
        pageTitle: video.name,
        video: video,
        openGraph: {
          siteName: config.siteName,
          title: video.name,
          url: sharingURL,
          description: video.description,
          image: video.images.thumbnail.src
        },
        twitterCard: {
          siteName: config.siteName,
          title: video.name,
          url: sharingURL,
          playerUrl: '',
          description: video.description,
          image: video.images.thumbnail.src
        }
      };
      res.render('share/main', context);
    }).catch(next);
  }
};

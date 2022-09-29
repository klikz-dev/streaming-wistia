'use strict';

var logger = require('node-logger')(module);
var stripe = require('node-stripe');
var cmsApi = require('../lib/cmsApi');

module.exports = function(config) {
  config.userIdentity(function(id) {
    id.isAuthenticated(function(user, cb) {
      // note that the "user" in this case, is the user
      // that was supplied by the routeHelpers.getUser function
      cb(null, !!user);
    });
  });

  config.routeHelpers(function(helpers) {
    // get the current user from the request object
    helpers.getUser(function(req, cb) {
      cb(null, req.user);
    });

    // Expose the video ID part of the detail page URL to the
    // "watch video" activity
    helpers.parameterMaps(function(params) {
      params.map('watch video', function(req) {
        // Look for a video ID in the params first (detail page), and if
        // not found, fallback to the request category (category detail page)
        var videoId = parseInt(req.params.videoId, 10);
        if (isNaN(videoId) && req.category) {
          if (req.category.collection.videos.length) {
            videoId = parseInt(req.category.collection.videos[0].id);
          }
        }

        return {
          videoId: videoId,
          locale: req.locale
        };
      });
    });
  });

  config.activities(function(activities) {
    activities.can('watch video', function(identity, params, callback) {
      if (isNaN(params.videoId)) {
        logger.info('authrz:isNaN:'+params.videoId);
        return callback(null, true);
      }

      if(typeof identity.user === 'undefined'){
        logger.info('authrz:no user');
        return callback(null, true);
      }

      // Admins have access to the entire catalog
      if (identity.user.role === 'admin') {
        logger.info('authrz:admin role');
        return callback(null, true);
      }

      var userId = identity.user.get('metadata').stripeUserId;
      var videoId = params.videoId;
      var locale = params.locale;

      if (!userId) {
        throw new Error('authrz: User does not have a Stripe account');
      }

      cmsApi.findVideoById(videoId, {
        account: locale
      }).then(function(collection) {
        return collection.videos[0];
      }).then(function(video) {
        // TODO: only do this if the user's role is 'user' and not 'admin'
        // TODO need to check if it's expired?
        return stripe.api.hasSubscriptionToVideo(video, userId).then(function(hasAccess) {
          logger.info('authrz: User %s authorization:', userId, hasAccess);
          callback(null, hasAccess);
        }).catch((err)=>{
          logger.error('authrz:get sub err:',err);
          callback(null,false);
          });
      }).catch((err)=>{
        logger.error('authrz:findVideo err:',err);
        callback(null,false);
      });
    });
  });
};

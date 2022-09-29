'use strict';

/*
The details controller designs the final part of determined path. It shows the selected video and also the
related videos and a list with all the other videos from the same category
*/

var logger = require('node-logger')(module);


/**
 * Loads the selected video details, the related videos and the list of videos in the same category.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */

module.exports.vpopPage = function(req, res, next) {

   var videoId = req.params.videoId;

   // If we still don't have a video id, 404
  if (!videoId || isNaN(videoId)) {
    console.error('Could not find a video ID to load the page with');
    req.error = {
      pageTitle: 'No Video Found',
      heading: 'No video found.',
      errorDetail: 'Videos not found'
    };
    return next();
  }

  // If the user doesn't have entitlements to this video
  if (!res.locals.isAuthorized) {
  }

    //free
    var isfree = req.session.fvids.indexOf(','+videoId+',') >= 0;
    logger.info('video '+videoId+' is free ?'+isfree);

  var category = req.category;
  var catCollection = category.collection;
  var video = category.collection.getVideoById(videoId);
  logger.info('vpop: video json='+JSON.stringify(video));
  catCollection.setActiveVideo(video);
/*  
    cmsApi.findVideoById(videoId).then(function(resp) {
      logger.info('vpop: get video '+videoId+':resp='+resp);
      logger.info('vpop: data='+resp.data);
      logger.info('vpop: data json='+JSON.stringify(resp.data));
      let video = resp.data;
*/
    // The object that'll be rendered against the mustache
    var context = {
      metatags: {
        title: video.name,
        description: video.description
      },
      pageTitle: video.name,
      video: video,
      isfree: isfree,
      layout: false
    };

    res.render('vpop/main', context);
//  }).catch(next);
};


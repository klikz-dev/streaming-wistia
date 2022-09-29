'use strict';
var settings = require('../config');
var lconfig = require('../locales/en/config');
var cmsApi = require('../lib/cmsApi');
var logger = require('node-logger')(module);

// This check the availability of the video and do the reload when necessary
module.exports = function videoAvailabilityCheck(req, res, next) {

  var config = settings.getLocaleSettings(req.locale);
  var tags = req.taxonomy.tags;
  var playlistVideoIds = req.taxonomy.playlistVideoIds;
  logger.info('...setup free videoids...');
  var cmsOpts = {
    encode: true,
    account: req.locale,
    fetch_all: true,
    tags: [],
    playlistVideoIds: [],
    analyticsData: req.analyticsData
  };
  var getPlaylists = function(playlists, carouselItems){
    if(playlists.length === 0) {
      return Promise.resolve(carouselItems);
    }
    var current = playlists[0];
    return cmsApi.findPlaylistById(current.playlistId, cmsOpts).then(function(resp){
      let vids=resp.data.video_ids;
      logger.info('vac: getPlaylists:'+current.title+',videos('+resp.videos.length+')=',
        resp.videos.map(function(v){return v.id;}).toString());
      var item = {
        title: current.title,
        videos: resp.videos.sort(function(a,b){       	
          return vids.indexOf(a.id.toString()) - vids.indexOf(b.id.toString());
        }),
        lazyLoadThumbails: true,
        showRating: settings.showRating
      };
      carouselItems.push(item);
      playlists.shift();
      return getPlaylists(playlists, carouselItems);
    });
  };

  if(req.session.fvids === undefined) {
    logger.info('vac:tags:',tags.toString());
    logger.info('vac:playlistVideoIds:',playlistVideoIds.toString());
    Promise.all([
      cmsApi.findPlaylistById(config.featuredVideosPlaylistId, cmsOpts),
//      config.freeVideos.playlistId ? cmsApi.findPlaylistById(config.freeVideos.playlistId, cmsOpts) : Promise.resolve([]),
      config.playlists.length !== 0 ? getPlaylists(config.playlists, []) : Promise.resolve([])
    ]).then(function(responses) {
      var featured = responses[0].videos || [],
//        free = responses[1].videos || [],
        carouselItems = responses[1];
  
        logger.info('vac:...setup free videoids...');
        //free videos
       let fvs = carouselItems.filter(function(citem) { 
         return citem.title === 'Teachers\' Lounge' || citem.title === 'Sneak Peeks' || citem.title === 'Webbies';
       });
       logger.info('vac:free videoids fvs:'+fvs.length);
       let avs =[].concat.apply([],fvs.map(fv=>fv.videos));
       logger.info('vac:free videoids avs:'+avs.length);
       let fvids = avs.map(function(v){return v.id;});
        logger.info('vac:free videoids free vids:'+fvids.length+'=',fvids.toString());
        let ffvids = featured.map(function(v){return v.id;});
        logger.info('vac:free videoids feat vids:'+ffvids.length+'=',ffvids.toString());
        req.session.fvids = ','+fvids.join()+',' + ffvids.join() + ',';
        logger.info('vac: free videoids session:',req.session.fvids);
      });      
  }

  var videoId = req.params.videoId;
  logger.info('vac:videoId='+videoId);

  // If a video ID isn't deliberately passed in, use the first
  // video from the category
  if (!videoId && req.category.collection.videos.length) {
    videoId = req.category.collection.videos[0].id;
    logger.info('vac:new videoId='+videoId);
  }

  //This returns undefined if the video has been recently activated and category collection is staled.
  //If video is undefined. reload category.
  logger.info('vac:'+req.category.url+' collection size=',req.category.collection.size());
  var video = req.category.collection.getVideoById(videoId);

  // Reload category if video cannot be found in the category colletion (staled response)
  if (typeof video === 'undefined') {
    logger.info('vac:category collection is staled, so reload... ');
    req.category.fetchVideos({
      account: req.locale,
      fetch_all: true,
      encode: true,
      cache: false
    }).then(function() {
      var video = req.category.collection.getVideoById(videoId);
      logger.info('vac:video with id='+videoId,video);
      // If the video still cannot be found, then will throw error message which means the video is currently unavailable
      // or deactivated.
      if (typeof video === 'undefined') {
        logger.error('vac:seems the video with id='+videoId+' is currently unavailable!!!');
        throw new Error(lconfig.videoUnavailableErrorMessage);
      }
      next();
    }).catch(next);
  } else {
    next();
  }

};


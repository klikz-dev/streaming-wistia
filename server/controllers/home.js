'use strict';
/*jshint camelcase: false*/

/*
The home page contains the featured videos playlist in a navigation bar carousel. Also, there are a second navigation panel with the most popular
videos. Below that, the list of most recent videos.
*/
var logger = require('node-logger')(module);

var settings = require('../config');
var cmsApi = require('../lib/cmsApi');
/**
 * Loads the home page with the feature videos in a navbar, the most popular videos below it and the most recent ones list after that.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */

module.exports.homePage = async function (req, res, next) {
  // logger.info('hpage:locale=', req.locale);
  var config = settings.getLocaleSettings(req.locale);

  // var tags = req.taxonomy.tags;
  // var playlistVideoIds = req.taxonomy.playlistVideoIds;
  // var prefix = '';
  // var cmsOpts = {
  //   encode: true,
  //   account: req.locale,
  //   fetch_all: true,
  //   tags: tags,
  //   playlistVideoIds: playlistVideoIds,
  //   analyticsData: req.analyticsData,
  // };
  // logger.info('hpage:tags=', tags.toString());
  // logger.info('hpage:playlistVideoIds=', playlistVideoIds.toString());

  // WORKAROUND: cms api has a weird behavior like this:
  // q: 'tags:automobiles +playable:true' return all the playableVideos
  // q: 'tags:nature,documentaries +playable:true' \
  // return videos that at least match of the tags.
  // q: '+tags:automobiles +playable:true' only return the videos that contains this tag.
  // so add a plus sign in front if there is only one tag.
  // if (tags.length === 1) {
  //   prefix = '+';
  // }

  // var getPlaylists = function (playlists, carouselItems) {
  //   if (playlists.length === 0) {
  //     return Promise.resolve(carouselItems);
  //   }
  //   var current = playlists[0];
  //   return cmsApi
  //     .findPlaylistById(current.playlistId, cmsOpts)
  //     .then(function (resp) {
  //       let vids = resp.data.video_ids;
  //       logger.info(
  //         'getPlaylists:' +
  //           current.title +
  //           ',videos(' +
  //           resp.videos.length +
  //           ')=',
  //         resp.videos
  //           .map(function (v) {
  //             return v.id;
  //           })
  //           .toString()
  //       );
  //       var item = {
  //         title: current.title,
  //         videos: resp.videos.sort(function (a, b) {
  //           return (
  //             vids.indexOf(a.id.toString()) - vids.indexOf(b.id.toString())
  //           );
  //         }),
  //         lazyLoadThumbails: true,
  //         showRating: settings.showRating,
  //       };
  //       carouselItems.push(item);
  //       playlists.shift();
  //       return getPlaylists(playlists, carouselItems);
  //     });
  // };

  //Call for featured videos, recent and most popular.
  // Promise.all([
  //   cmsApi.findPlaylistById(config.featuredVideosPlaylistId, cmsOpts),
  //   config.freeVideos.playlistId
  //     ? cmsApi.findPlaylistById(config.freeVideos.playlistId, cmsOpts)
  //     : Promise.resolve([]),
  //   config.playlists.length !== 0
  //     ? getPlaylists(config.playlists, [])
  //     : Promise.resolve([]),
  // ])
  //   .then(function (responses) {
  //     var featured = responses[0].videos || [],
  //       free = responses[1].videos || [],
  //       carouselItems = responses[2];

  //     //free videos
  //     let fvs = carouselItems.filter(function (citem) {
  //       return (
  //         citem.title === "Teachers' Lounge" ||
  //         citem.title === 'Sneak Peeks' ||
  //         citem.title === 'Webbies'
  //       );
  //     });
  //     logger.info('free videoids fvs:' + fvs.length);
  //     let avs = [].concat.apply(
  //       [],
  //       fvs.map((fv) => fv.videos)
  //     );
  //     logger.info('free videoids avs:' + avs.length);
  //     let fvids = avs.map(function (v) {
  //       return v.id;
  //     });
  //     logger.info(
  //       'free videoids free vids:' + fvids.length + '=',
  //       fvids.toString()
  //     );
  //     let ffvids = featured.map(function (v) {
  //       return v.id;
  //     });
  //     logger.info(
  //       'free videoids feat vids:' + ffvids.length + '=',
  //       ffvids.toString()
  //     );
  //     req.session.fvids = ',' + fvids.join() + ',' + ffvids.join() + ',';
  //     logger.info('free videoids session:', req.session.fvids);

  //     //This array has the same order as the playlist in the video cloud
  //     var featuredIdOrderByPlaylist = responses[0].data.video_ids;

  //     //Order videos by the order in the playlist
  //     featured.sort(function (a, b) {
  //       return (
  //         featuredIdOrderByPlaylist.indexOf(a.id.toString()) -
  //         featuredIdOrderByPlaylist.indexOf(b.id.toString())
  //       );
  //     });

  //     //Map videos with Marketing Text
  //     for (var i = 0; i < config.marketingOverlay.length; i++) {
  //       //If no more videos available, finish mapping
  //       if (!featured[i]) break;

  //       featured[i].marketingOverlay = config.marketingOverlay[i];
  //     }

  //     if (free.length !== 0) {
  //       carouselItems.unshift({
  //         title: config.freeVideos.title,
  //         videos: free,
  //         lazyLoadThumbails: true,
  //         showRating: settings.showRating,
  //       });
  //     }

  //     console.log(featured);
  //     console.log(carouselItems);

  //     //Render both carousels for the page and the most recent videos grid.
  //     res.render('home/main', {
  //       carousels: {
  //         hero: {
  //           videos: featured,
  //           lazyLoadThumbails: true,
  //         },
  //         standard: carouselItems,
  //       },
  //     });
  //   })
  //   .catch(next);

  // const featuredProjectRes = await cmsApi.getProject(config.featuredProjectId);
  // const featuredProject = JSON.parse(featuredProjectRes);
  // const featuredMedias = featuredProject.medias.slice(0, 4);

  const featuredMedias = [];
  for (let i = 0; i < config.featuredMediaIds.length; i++) {
    const mediaId = config.featuredMediaIds[i];

    const mediaRes = await cmsApi.getVideo(mediaId);
    const media = mediaRes.videos[0];
    featuredMedias.push(media);
  }

  const webstreamsData = await cmsApi.getProject(6568576);

  const carouselItems = [];
  for (let i = 0; i < config.featuredTags.length; i++) {
    const featuredTag = config.featuredTags[i];
    const tagData = config.tags[featuredTag];

    const videos = [];
    for (let j = 0; j < tagData.medias.length; j++) {
      const mediaId = tagData.medias[j];
      const wistiaMediaData = webstreamsData.videos.filter(
        (media) => media.id == mediaId
      )[0];

      videos.push(wistiaMediaData);
    }

    carouselItems.push({
      id: featuredTag,
      title: tagData.name,
      videos: videos,
    });
  }

  res.render('home/main', {
    carousels: {
      hero: {
        videos: featuredMedias,
        lazyLoadThumbails: true,
      },
      standard: carouselItems,
    },
  });
};

'use strict';

/*
The details controller designs the final part of determined path. It shows the selected video and also the
related videos and a list with all the other videos from the same category
*/

var settings = require('../config');
var hbs = require('../lib/hbs');
var cmsApi = require('../lib/cmsApi');

/**
 * Loads the selected video details, the related videos and the list of videos in the same category.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */
module.exports.detailPage = async function (req, res, next) {
  if (
    typeof settings.disqus !== 'undefined' &&
    req.query.d &&
    req.query.d === 'logout'
  ) {
    req.session.disqusLogout = true;
    return res.redirect(req.path);
  }

  const config = settings.getLocaleSettings(req.locale);

  const sortBy = req.query.sort || 'date';
  const currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;

  const tagId = req.params.tagId;
  const tagData = config.tags[tagId];

  const webstreamsData = await cmsApi.getProject(6568576);

  const tagVideos = [];

  if (tagData) {
    for (let j = 0; j < tagData.medias.length; j++) {
      const mediaId = tagData.medias[j];
      const wistiaMediaData = webstreamsData.videos.filter(
        (media) => media.id == mediaId
      )[0];

      tagVideos.push(wistiaMediaData);
    }
  }

  webstreamsData.videos = tagVideos;

  const pagination = webstreamsData.paginate(24, currentPage);
  const videos = pagination.getVideos();

  var videoId = req.params.videoId;

  if (!videoId && webstreamsData.videos.length) {
    videoId = webstreamsData.videos[0].id;
  }

  // If we still don't have a video id, 404
  if (!videoId || isNaN(videoId)) {
    console.error('Could not find a video ID to load the detail page with');
    req.error = {
      pageTitle: 'No Video Found',
      heading: 'No video found for this category.',
      errorDetail: 'Videos not found',
    };
    return next();
  }

  const videoRes = await cmsApi.getVideo(videoId);
  const video = videoRes.videos[0];

  //Calls the handlebars library to actually load the page for the video list
  if (req.xhr) {
    const xhrPagination = pagination;
    delete xhrPagination.pageItems;
    return hbs
      .renderPartial('components/video-list/video-list', {
        videos: videos,
        category: undefined,
        showRating: false,
      })
      .then(function (html) {
        res.json({
          pagination: xhrPagination,
          html: html,
        });
      });
  }

  res.render('detail/main', {
    video: video,
    videos: videos,
    projectId: tagId,
    projectName: tagData.name,
    pagination: {
      ...pagination,
      isSortable: webstreamsData.isSortable(),
      sortBy: sortBy,
      isDateActive: sortBy === 'date',
      isNameActive: sortBy === 'name',
    },
  });
};

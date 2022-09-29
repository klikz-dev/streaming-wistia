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

  const sortBy = req.query.sort || 'date';
  var currentPage = req.query.page ? parseInt(req.query.page, 10) : 1;

  const projectId = req.params.projectId;

  const project = await cmsApi.getProject(projectId);

  const pagination = project.paginate(24, currentPage);
  const videos = pagination.getVideos();

  var videoId = req.params.videoId;

  if (!videoId && project.videos.length) {
    videoId = project.videos[0].id;
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
    projectId: project.id,
    projectName: project.name,
    pagination: {
      ...pagination,
      isSortable: project.isSortable(),
      sortBy: sortBy,
      isDateActive: sortBy === 'date',
      isNameActive: sortBy === 'name',
    },
  });
};

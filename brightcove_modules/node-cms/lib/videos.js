'use strict';
var utils = require('./utils');

/**
 * Gets a list of the specified playlist(s)
 * @param {String|Array} playlistIds - either the id of a single playlist or an array of ids
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.list = async function () {
  return await utils.send('/medias.json');
};

/**
 * Gets a list of videos in the specified playlist
 * @param {String} videoId - the id of the playlist
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.get = async function (videoId) {
  return await utils.send('/medias/' + videoId + '.json');
};

module.exports.search = async function (keyword) {
  const allVideos = [];
  for (let i = 1; i < 100; i++) {
    const videos = await utils.send('/medias.json?page=' + i + '&per_page=100');
    allVideos = [...allVideos, ...videos];
  }
  return await utils.send('/medias.json');
};

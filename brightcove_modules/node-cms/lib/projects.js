'use strict';
var utils = require('./utils');

/**
 * Gets a list of the specified playlist(s)
 * @param {String|Array} playlistIds - either the id of a single playlist or an array of ids
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.list = async function () {
  return await utils.send('/projects.json');
};

/**
 * Gets a list of videos in the specified playlist
 * @param {String} projectId - the id of the playlist
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.get = async function (projectId) {
  return await utils.send('/projects/' + projectId + '.json');
};

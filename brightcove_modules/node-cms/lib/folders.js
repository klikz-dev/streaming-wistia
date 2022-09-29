'use strict';
var utils = require('./utils');
var _ = require('lodash');

var endpoint = '/folders/';
var videos = '/videos/';

/**
 * Gets a list of folders in the account
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.list = function(opts) {
	return utils.send(endpoint, 'GET', undefined, opts);
};

/**
 * Creates a new folder
 * @param {Object} params - params for the new folder
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.create = function(params, opts) {
	var invalid = utils.validate(params, {
		name: { required: true }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint, 'POST', params, opts);
};

/**
 * Gets a list of folders in the account
 * @param {String} folderId - the id of the folder
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.get = function(folderId, opts) {
	var invalid = utils.validate(folderId, {
		folder_id: { required: true }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint+folderId, 'GET', undefined, opts);
};

/**
 * Updates the specified folder
 * @param {String} folderId - the id of the folder
 * @param {Object} params - updated params for the folder
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.update = function(folderId, params, opts) {
	var invalid = utils.validate(_.merge({}, params, { 'folder_id': folderId}), {
		folder_id: { required: true }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint+folderId, 'PATCH', params, opts);
};

/**
 * Deletes the specified folder
 * @param {String} folderId - the id of the folder
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.delete = function(folderId, opts) {
	var invalid = utils.validate(folderId, {
		folder_id: { required: true }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint+folderId, 'DELETE', undefined, opts);
};

module.exports.videos = {
	/**
	 * Lists the videos in the specified folder
	 * @param {String} folderId - the id of the folder
	 * @returns {Promise} that resolves to the API response or an Error
	 */
	list: function(folderId, opts) {
		var invalid = utils.validate(folderId, {
			folder_id: { required: true }
		});

		if(invalid)
			return invalid;
		return utils.send(endpoint+folderId+videos, 'GET', undefined, opts);
	},

	/**
	 * Adds the specified video to the specified folder
	 * @param {String} folderId - the id of the folder
	 * @param {String} videoId - the id of the video to add
	 * @param {Object} [opts] - additional options for the request
	 * @returns {Promise} that resolves to the API response or an Error
	 */
	add: function(folderId, videoId, opts) {
		var invalid = utils.validate({folder_id: folderId, video_id: videoId}, {
			folder_id: { required: true},
			video_id: { required: true }
		});

		if(invalid)
			return invalid;
		return utils.send(endpoint+folderId+videos+videoId, 'PUT', undefined, opts);
	},

	/**
	 * Removes the specified video to the specified folder
	 * @param {String} folderId - the id of the folder
	 * @param {String} videoId - the id of the video to remove
	 * @param {Object} [opts] - additional options for the request
	 * @returns {Promise} that resolves to the API response or an Error
	 */
	remove: function(folderId, videoId, opts) {
		var invalid = utils.validate({folder_id: folderId, video_id: videoId}, {
			folder_id: { required: true},
			video_id: { required: true }
		});

		if(invalid)
			return invalid;
		return utils.send(endpoint+folderId+videos+videoId, 'DELETE', undefined, opts);
	}
};



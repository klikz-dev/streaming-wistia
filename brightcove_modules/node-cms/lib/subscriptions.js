'use strict';
var utils = require('./utils');

var endpoint = '/subscriptions/';

/**
 * Gets the specified subscription
 * @param {String} subscriptionId - the id of the subscription
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.get = function(subscriptionId, opts) {
	var invalid = utils.validate(subscriptionId, {
		subscription_id: { required: true }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint+subscriptionId, 'GET', undefined, opts);
};

/**
 * Creates a new subscription
 * @param {Object} params - params for the new subscription
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.create = function(params, opts) {
	var invalid = utils.validate(params, {
		endpoint: { required: true },
		events: { required: true, type: 'array' }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint, 'POST', params, opts);
};

/**
 * Deletes the specified subscription
 * @param {String} subscriptionId - the id of the subscription
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.delete = function(subscriptionId, opts) {
	var invalid = utils.validate(subscriptionId, {
		subscription_id: { required: true }
	});

	if(invalid)
		return invalid;
	return utils.send(endpoint+subscriptionId, 'DELETE', undefined, opts);
};

/**
 * Gets a list of subscriptions in the account
 * @param {Object} [opts] - additional options for the request
 * @returns {Promise} that resolves to the API response or an Error
 */
module.exports.list = function(opts) {
	return utils.send(endpoint, 'GET', undefined, opts);
};


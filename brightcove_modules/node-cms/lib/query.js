'use strict';

/**
 * @private
 * Formats the array of dates into the API search string
 * @param {Array} dateRange - an array of the upper and lower dates of the range. They can be Strings or Date objects
 * @returns {String} of the date query
 */
var formatDate = function(dateRange) {
	var dates = [undefined, undefined];

	for(var i = 0, len = dateRange.length; i < len; i++) {
		dates[i] = dateRange[i] instanceof Date ? dateRange[i].toISOString() : dateRange[i];
	}

	return dates.join('..');
};

/**
 * @private
 * Formats a QUERY_TERM, applying the correct boolean and formatting
 * @param {Object} q - the query object. Contains key/value pairs to flatten into a query string
 * @param {String} [bool] - an optional boolean operator to apply to query params
 * @returns {String} of the query
 */
var formatQ = function(q, bool) {
	var qs=[];
	var dateFields = ['updated_at', 'created_at', 'schedule.starts_at', 'schedule.ends_at', 'published_at'];
	var boolFields = { 'AND': '+', 'NOT': '-' };
	var prefix = boolFields.hasOwnProperty(bool) ? boolFields[bool] : '';

	if(typeof q === 'string') {
		return prefix + q;
	}

	for(var param in q) {
		var parsed = prefix + param + ':' +
			(dateFields.indexOf(param)>=0 ? formatDate(q[param]) : q[param]);
		qs.push(parsed);
	}
	return qs.join(' ');
};

/**
 * This parses a query array and returns the appropriate query string. Arrays are formed in the following matter as [QUERY_TERM1, QUERY_TERM2, ...]
 * Each QUERY_TERM is an object containing field:value pairs, with the fields being the video cloud fields to include in the query
 * These are covered in more detail in: http://docs.brightcove.com/en/video-cloud/cms-api/guides/search-videos.html
 * QUERY_TERMs can also be the keywords AND or NOT (case sensitive) which will apply the appropriate logic to the previous/next QUERY_TERMs
 * If a "field" is any of the date fields, it will expect "value" to be an array of either strings or date objects
 * Example: Return videos with the name "gossip" which do not have the tag "bar" and were updated between 8/1/10 and 10/8/10
 * query: ['NOT', { tags: "bar"}, { name: "gossip" }, 'AND', { updated_at: [ new Date(2010, 7, 1), new Date(2010, 9, 8)]}]
 * parsed: "%2Dtags:bar+%2Bname:gossip+%2Bupdated_at:2010-08-01T04:00:00.000Z..2010-10-08T04:00:00.000Z"
 * @param {Array} query - a list of QUERY_TERMs that constitute the q param of the query
 * @returns {String} of the query
 */

module.exports.parse = function(query) {
	var ignore = ['AND','NOT'];
	var qs = [];
	var bool;

	for(var i=0, len=query.length; i<len; i++) {
		var part = query[i];
		if(ignore.indexOf(part)>=0)
			continue;

		bool = undefined;
		if(i > 0 && query[i-1] === 'NOT')
			bool = 'NOT';
		else if((i+1) < len && query[i+1] === 'AND' || i > 0 && query[i-1] === 'AND')
			bool = 'AND';

		qs.push(formatQ(part, bool));
	}
	return qs.join(' ');
};


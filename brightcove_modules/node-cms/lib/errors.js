'use strict';
var generaterr = require('generaterr');
var errors = { text: {} };

errors.ConnectionError = generaterr('ConnectionError');
errors.text.ConnectionError = 'Unable to connect to Brightcove';

errors.MissingReqsError = generaterr('MissingRequirementsError');
errors.text.MissingReqsError = 'You are missing the following required parameters: {params}';

errors.InvalidParamsError = generaterr('InvalidParametersError');
errors.text.InvalidParamsError = 'Validation of one or more parameters failed';
errors.text.InvalidParamType = '"%p" must be the following type: %t';
errors.text.RejectedParamValue = '\"%p\" doesn\'t take the following value: %v';

errors.MaxRetriesError = generaterr('MaxRetriesError');
errors.text.MaxRetriesError = 'This request has reached the max number of attempts it can be retried.';

/**
 * @private
 * Transforms an API error name to the javascript camel case style (i.e. error_msg -> ErrorMsg)
 * @param {String} string - the error name
 * @returns {String} of the error name in camel case
 */
var underscoreToCamel = function(string) {
	return string.split('_').map(function(part) {
		return part[0].toUpperCase() + part.substring(1).toLowerCase();
	}).join('');
};

/**
 * Creates a wholly new error given the name and description specified. Used to allow any type of error to be properly returned
 * @param {String} name - the error name
 * @pram {String} description - the error message
 * @returns {Error} of the newly created error
 */
errors.newError = function(name, message) {
	name = underscoreToCamel(name);
	message = (message || '').replace(/&quot;/g,'"');
	var Err = generaterr(name);
	return new Err(message);
};

/**
 * Returns a predefined error. These are ones thrown by the module as opposed to the CMS API
 * @param {String} name - the error name
 * @param {String} [msg] - an optional error message to replace the default
 * @param {Object} [data] - any data that should be included in the error
 * @returns {Error} of the newly created error
 */
errors.getError = function(name, msg, data) {
	var err = new errors[name](msg ? msg : errors.text[name]);
	if(data)	err.data = data;
	return err;
};

module.exports = errors;

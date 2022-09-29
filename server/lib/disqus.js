'use strict';

var _ = require('lodash');
var settings = require('../config');
var crypto = require('crypto');

/**
 * Encryption with sha1 encoding.
 * @param {String} key - The key for the hash that will be created.
 * @param {String} message - The message that will be encrypted.
 * @return {String} the read value in the hash
 */

var sha1_hash = function(key, message) {
  var hash = crypto.createHmac('sha1', key);
  hash.write(message);
  hash.end();
  return hash.read().toString('hex');
};

/**
 * Get the request url.
 * @param {Object} req - GET request object.
 * @return {String} the new url from the request
 */

var getURL = function(req) {
  return req.protocol + '://' + req.hostname + ':' + settings.port + req.originalUrl;
};

/**
 * Get the discussion ID.
 * @param {Object} req - GET request object.
 * @return {String} the new url from the request
 */

module.exports.getDiscussionId = function(req) {
  var config = settings.getLocaleSettings(req.locale);
  return config.disqus.uniquePerLocale ? req.params.videoId + '/' + config.locale : req.params.videoId;
};

/**
 * Get the disqus login context object.
 * @param {Object} req - GET request object.
 * @return {Object} the disques login object configuration
 */

module.exports.loginContext = function(req) {
  var config = settings.getLocaleSettings(req.locale);
  var payload;

  if (req.isAuthenticated()) {
    var messageJSON = {
      id: req.user.id,
      username: req.user.email.split('@')[0],
      email: req.user.email
    };
    var message = new Buffer(JSON.stringify(messageJSON)).toString('base64');
    var timestamp = Math.floor(Date.now() / 1000).toString();
    var hmac = sha1_hash(config.disqus.secretKey, message + ' ' + timestamp);
    payload = [message, hmac, timestamp].join(' ');
  } else {
    payload = '';
  }
  return _.merge({}, config.disqus, {
    payload: payload,
    login: config.disqus.loginUrl.replace('{port}', config.port),
    logout: getURL(req) + '?d=logout'
  });
};

/**
 * Send the window close javascript function.
 * @param {Object} req - GET request object.
 * @param {Object} res - GET request response.
 */

module.exports.loginPopup = function(req, res) {
  res.send('<script>window.close()</script>');
};

/**
 * Get the disqus logout context object.
 * @param {Object} req - GET request object.
 * @return {Object} the logout object configuration
 */

module.exports.logoutContext = function(req) {
  var config = settings.getLocaleSettings(req.locale);
  var message = new Buffer('{}').toString('base64');
  var timestamp = Math.floor(Date.now() / 1000).toString();
  var hmac = sha1_hash(config.disqus.secretKey, message + ' ' + timestamp);
  var payload = [message, hmac, timestamp].join(' ');

  return _.merge({}, config.disqus, {
    payload: payload,
    login: config.disqus.loginUrl.replace('{port}', config.port),
    logout: getURL(req) + '?d=logout'
  });
};

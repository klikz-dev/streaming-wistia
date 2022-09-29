'use strict';

var config = require('../config');
var utils = require('./utils');
var logger = require('node-logger')(module);

var BASE_URL = config.sso.baseURL;
var USERS = config.sso.paths.users;
var ADMINS = config.sso.paths.admins;
var STRIPE = config.sso.paths.stripe;

var api = function() {};

String.prototype.addPath = function(path) {
  var newPath = this + '/' + path;
  return newPath;
};

/** =======================================
  * Utils
    =======================================**/

var objToParamStr = utils.objToParamStr;

var lowerCaseKeyForObj = utils.lowerCaseKeyForObj;

var sendRequest = utils.sendRequest;

var lowerCaseKeyForRespObj = function(resp) {
  resp.map(lowerCaseKeyForObj);
  return resp;
};

var searchUsers = function(params, path) {
  if (typeof path === 'undefined') {
    path = params.role === 'user' ? USERS : ADMINS;
  }
  if (params.keyword === '') {
    delete params.keyword;
  }
  var options = {
    url: BASE_URL.addPath(path) + objToParamStr(params),
    method: 'GET'
  };
  return sendRequest(options);
};

/** =======================================
  * General
    =======================================**/

api.getUserById = function(id, role) {
  if (typeof role !== 'undefined' && role === 'user') {
    return searchUsers({
      Id: id
    }, USERS);
  } else if (typeof role !== 'undefined' && role === 'admin') {
    return searchUsers({
      Id: id
    }, ADMINS);
  } else {
    return searchUsers({
      Id: id
    }, ADMINS).then(function(users) {
      if (JSON.parse(users).length === 0) {
        return searchUsers({
          Id: id
        }, USERS);
      } else {
        return users;
      }
    });
  }
};

/** =======================================
  * Admins
    =======================================**/

api.getAdmins = function(path) {
  path = typeof path === 'undefined' ? ADMINS : path;
  var options = {
    url: BASE_URL.addPath(path),
    method: 'GET'
  };
  return sendRequest(options);
};

/** =======================================
  * Users
    =======================================**/

api.getUsers = function(path) {
  path = typeof path === 'undefined' ? USERS : path;
  var options = {
    url: BASE_URL.addPath(path),
    method: 'GET'
  };
  return sendRequest(options);
};

api.searchUsers = function(params, path) {
  return searchUsers(params, path);
};

/** =======================================
  * Stripe Id
    =======================================**/

api.updateStripeId = function(userId, stripeId, path) {
  path = typeof path === 'undefined' ? STRIPE : path;
  var body = {
      stripeid: stripeId
    },
    options = {
      uri: BASE_URL.addPath(path).addPath(userId),
      method: 'PUT',
      json: true,
      body: body
    };
  return sendRequest(options);
};


module.exports = api;

Object.keys(module.exports).forEach(function(method) {

  if (['updateStripeId'].indexOf(method) >= 0) {
    return;
  }

  var oldMethod = module.exports[method];
  module.exports[method] = function() {
    return (oldMethod.apply(null, arguments)).then(function(resp) {
      var objs = JSON.parse(resp),
        result;
      result = lowerCaseKeyForRespObj(objs);
      if (['getUserById'].indexOf(method) >= 0) {
        return result[0];
      }
      return result;
    }).catch(function(err) {
      logger.error(err.stack);
      logger.error(err.message);
    });
  };
});

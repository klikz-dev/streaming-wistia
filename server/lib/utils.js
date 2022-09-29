'use strict';

var _ = require('lodash');
var request = require('request');
var logger = require('node-logger')(module);

var objToParamStr = function(options) {
  var params = '?';
  Object.keys(options).forEach(function(key) {
    var value = options[key];
    params += key + '=' + value + '&';
  });
  return params.substring(0, params.length - 1);
};

var paramStrToObj = function(paramStr) {
  var params = paramStr.split('&'),
    result = {};
  params.forEach(function(param) {
    var pair = param.split('=');
    result[pair[0]] = pair[1];
  });
  return result;
};

var lowerCaseKeyForObj = function(obj) {
  _.forOwn(obj, function(value, key) {
    var newKey = key.toLowerCase();
    obj[newKey] = value;
    delete obj[key];
  });
  return obj;
};

var sendRequest = function(options) {
  return new Promise(function(resolve) {
    request(options, function(err, response) {
      if (err) {
        logger.error(err);
      }
      resolve(response.body);
    });
  });
};

var makeSlug = function(str) {
  return str.trim()
  .toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^a-z0-9\-]+/ig, '')
  .replace(/\./g, '_');
};
module.exports = {
  objToParamStr: objToParamStr,
  paramStrToObj: paramStrToObj,
  lowerCaseKeyForObj: lowerCaseKeyForObj,
  sendRequest: sendRequest,
  makeSlug: makeSlug
};

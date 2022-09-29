'use strict';

var cms = require('node-cms');
var config = require('../config');
var request = require('request');
var generaterr = require('generaterr');
var _ = require('lodash');
var AWS = require('aws-sdk');

var DEFAULT_VC_PROFILE = 'single-bitrate-standard';
var API_ENDPOINT = 'https://ingest.api.brightcove.com/v1/accounts/{account_id}/videos/{video_id}/ingest-requests';

/**
 * Throws an error if request fails.
 * @param {String} name - name of error
 * @param {String} message - error log message
 * @returns {Object} the error message object
 */

var newError = function(name, message) {
  name = _.camelCase(name);
  message = (message || '').replace(/&quot;/g, '"');
  var Err = generaterr(name);
  return new Err(message);
};

/**
 * Make a request for the ingestion.
 * @param {String} options - the options specifications to run the request
 * @returns {Promise} promise that resolves with a status object
 */

var makeRequest = function(options) {
  return new Promise(function(resolve, reject) {
    request(options, function(err, response, body) {
      if (response.statusCode === 204) {
        body = {};
      } else if (typeof body !== 'object') {
        try {
          body = JSON.parse(body);
        } catch (error) {
          return reject(error);
        }
      }

      if (err)
        reject(err);
      else if (body.error)
        reject(newError(body.error, body.error_description));
      else if (body instanceof Array && body.length === 1 && body[0].error_code)
        reject(newError(body[0].error_code, body[0].message));
      else {
        resolve({
          statusCode: response.statusCode,
          request: _.pick(response.request, ['href', 'method']),
          cached: false,
          data: body
        });
      }
    });
  });
};

/**
 * Ingest a video with the required parameters.
 * @param {String} params - parameters of the ingested video.
 */

module.exports.ingest = function(params) {
  return cms.getAccessToken().then(function(accessToken) {
    var url = params.url;
    var hostname = params.hostname;

    params = _.omit(params, ['url', 'hostname']);

    return cms.videos.create(params).then(function(resp) {
      console.log('dynamicIngest:ingest:create video:config='+JSON.stringify(config));
      var accountId = config.cms.accountId;
      var videoId = resp.data.id;
      var endpoint = API_ENDPOINT.replace('{account_id}', accountId).replace('{video_id}', videoId);

      var options = {
        url: endpoint,
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken.body
        },
        json: true,
        body: {
          master: {
            url: url
          },
          profile: config.ugc.videoProfile || DEFAULT_VC_PROFILE,
          'capture-images': true,
          callbacks: [hostname + '/upload/callback']
        }
      };

      return makeRequest(options, accessToken);
    });
  });
};

/**
 * Renders a partial.
 * @param {String} name - name of the partial, like "components/foo/foo". Must be relative to config.templates.partialsDir.
 * @param {Object} context - context to render against
 * @returns {Promise} promise that resolves with an update from AWS
 */

module.exports.deleteSource = function(id) {
  if (!AWS.credentials || AWS.credentials.expired) {
    var creds = _.pick(config.ugc, ['accessKeyId', 'secretAccessKey']);
    AWS.config.update(creds);
  }

  return cms.videos.get(id).then(function(res) {
    var key = res.data.custom_fields[config.ugc.s3field];
    var s3 = new AWS.S3();

    return new Promise(function(resolve, reject) {
      s3.deleteObject({
        Bucket: config.ugc.bucket,
        Key: key
      }, function(err) {
        if (err)
          return reject(err);
        resolve(true);
      });
    });
  });
};

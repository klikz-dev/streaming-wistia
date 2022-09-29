'use strict';
/*jshint camelcase: false*/
var config = require('../config');
var moment = require('moment');
var di = require('../lib/dynamicIngest');
var crypto = require('crypto');
var _ = require('lodash');
var logger = require('node-logger');

/**
 * Loads the page for video uploads by users.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 */

module.exports.getUserUpload = function(req, res) {
  res.render('upload/main', {});
};

/**
 * Encryption with sha56 encoding.
 * @param {string} key - The key for the hash that will be created.
 * @param {string} message - The message that will be encrypted.
 * @return the read value in the hash
 */

var sha256_hash = function(key, message) {
  var hash = crypto.createHmac('sha256', key);
  hash.write(message);
  hash.end();
  return hash.read();
};

/**
 * Create a signature to a string using sha56 and date/region/keys parameters.
 * @param {string} stringToSign - The string to be signed.
 * @param {string} secret - The secret access key.
 * @param {string} region - The reffered region.
 * @param {string} service - The referred service.
 * @return the signature string
 */

var createSignature = function(stringToSign, secret, region, service) {
  var dateKey = sha256_hash('AWS4' + config.ugc.secretAccessKey || secret, moment().format('YYYYMMDD'));
  var dateRegionKey = sha256_hash(dateKey, config.ugc.region || region);
  var dateRegionServiceKey = sha256_hash(dateRegionKey, 's3' || service);
  var signingKey = sha256_hash(dateRegionServiceKey, 'aws4_request');
  return sha256_hash(signingKey, stringToSign).toString('hex');
};

/**
 *
 *
 *
 *
 *
 */

module.exports.postUploadCreds = function(req, res) {
  var ugc = config.ugc;
  var expiration = new Date();
  expiration.setHours(expiration.getHours() + 2);
  var keyStart = '';

  var policy = {
    expiration: expiration.toISOString(),
    conditions: [{
        bucket: ugc.bucket
      },
      ['starts-with', '$key', keyStart], {
        'acl': 'public-read'
      }, {
        'x-amz-algorithm': 'AWS4-HMAC-SHA256'
      }, {
        'x-amz-credential': [ugc.accessKeyId, moment().format('YYYYMMDD'), ugc.region, 's3', 'aws4_request'].join('/')
      }, {
        'x-amz-date': moment().format('YYYYMMDD') + 'T000000Z'
      }
    ]
  };

  var stringToSign = new Buffer(JSON.stringify(policy)).toString('base64');
  var signature = createSignature(stringToSign);

  res.send({
    bucket: ugc.bucket,
    url: 'http://{bucket}.s3.amazonaws.com/'.replace('{bucket}', ugc.bucket),
    expiration: expiration.toISOString(),
    aws: {
      key: keyStart,
      Policy: stringToSign,
      'X-Amz-Signature': signature,
      acl: policy.conditions[2].acl,
      'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
      'X-Amz-Credential': policy.conditions[4]['x-amz-credential'],
      'X-Amz-Date': policy.conditions[5]['x-amz-date']
    }
  });
};

/**
 *
 *
 *
 *
 *
 */

module.exports.postCompleteUpload = function(req, res) {
  var name = req.body.name.substring(0, req.body.name.lastIndexOf('.'));
  var key = req.body.key;
  var keyField = config.ugc.s3field;
  var params = {
    name: name,
    'custom_fields': {},
    state: 'INACTIVE',
    url: 'http://{bucket}.s3.amazonaws.com/{key}'
      .replace('{bucket}', config.ugc.bucket)
      .replace('{key}', key),
    hostname: '{protocol}://{hostname}'
      .replace('{protocol}', req.protocol)
      .replace('{hostname}', req.hostname)
  };
  params.custom_fields[keyField] = key;
  params = _.merge({}, config.ugc.params || {}, params);

  di.ingest(params).then(function() {
    res.send('success!');
  }).catch(function(err) {
    logger.error(err.message);
    res.status(500).send(err.message);
  });
};

/**
 *
 *
 *
 *
 *
 */

module.exports.postIngestCallback = function(req, res) {
  if (req.body.status === 'SUCCESS') {
    return di.deleteSource(req.body.entity).then(function() {
      res.send('success!');
    }).catch(function(err) {
      res.status(500).send(err.message);
    });
  }
  res.status(500).send('Something went wrong.');
};

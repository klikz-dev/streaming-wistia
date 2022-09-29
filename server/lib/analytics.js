'use strict';

var request = require('request');
var _ = require('lodash');
var config = require('../config');
var cmsApi = require('./cmsApi');
var cache = cmsApi.getStore();
var logger = require('node-logger')(module);

var API_ENDPOINT = 'https://analytics.api.brightcove.com/v1/data';
var API_PARAMS = '?accounts={account_id}&dimensions=video&fields=video_view&from=alltime&sort=-video_view&limit=all';

function fetchAnalytics(url) {
  return cmsApi.getAccessToken().then((token) => {
    return new Promise((resolve) => {
      let options = {
        url: url,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.body}`
        }
      };

      request(options, (err, response) => {
        let analytics = {};
        let data;

        if (err) {
          logger.error('analytics fetch error', err);
          return resolve(analytics);
        }

        try {
          data = JSON.parse(response.body);
        } catch (e) {
          logger.error('analytics parse error', e);
          return resolve(analytics);
        }

        if (data.items) {
          data.items.forEach((fields) => {
            if (!fields.video)
              return;
            analytics[fields.video] = _.omit(fields, ['video']);
          });
        }

        if (config.cache.enabled && _.keys(analytics).length > 0) {
          cache.set(config.analytics.key, analytics, config.analytics.ttl, (err) => {
            if (err)
              logger.error('analytics cache set error', err);
            resolve(analytics);
          });
        } else {
          resolve(analytics);
        }
      });
    });
  });
}

/**
 * Gets the current analytics data. If its cached it will attempt to retrieve it from the cache otherwise it will fetch new data.
 * @return {Promise} - this resolves to an object of videoId -> analytics
 */
module.exports.get = function(locale) {
  console.log('analytics:get:cms='+JSON.stringify(config.getLocaleSettings(locale).cms));
  var accountId = config.getLocaleSettings(locale).cms.accountId;
  var url = API_ENDPOINT + API_PARAMS.replace('{account_id}', accountId);
  if (config.cache.enabled) {
    return new Promise((resolve) => {
      cache.get(config.analytics.key, (err, results) => {
        if (err) {
          logger.error('analytics get error', err);
        }
        if (err || !results) {
          return fetchAnalytics(url).then(resolve);
        }
        resolve(results);
      });
    });
  }
  return fetchAnalytics(url);
};

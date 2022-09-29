'use strict';

var config = require('../config').getLocaleSettings();
var VideoCollection = require('../models/videoCollection');
var cacheManager = require('cache-manager');
var cms = require('node-cms');
var store;
var _ = require('lodash');
var logger = require('node-logger')(module);
var globalConfig = require('../config');
var moment = require('moment');

// Memory cache
// if(config.cms.cache.enabled) {
//   store = new NodeCache({
//     stdTTL: config.cms.cache.stdTTL,
//     checkperiod: config.cms.cache.checkperiod,
//     useClones: false
//   });
// }

// Redis Cache
if (config.cache.enabled) {
  store = cacheManager.caching(config.cache.opts);
}

// listen for redis connection error event
if (config.cache.enabled && config.cache.opts.store !== 'memory') {
  store.store.events.on('redisError', function (err) {
    logger.error(err);
  });
}

// Add all localization accounts
// for (var i = 0, len = config.localization.locales.length; i < len; i++) {
//   var locale = config.localization.locales[i];
//   var settings = config.getLocaleSettings(locale);

//   if (cms.initialized())
//     cms.addAccount(settings.cms, locale);
//   else
//     cms.init(settings.cms, locale, {
//       store: store,
//       retry: true
//     });
// }

/**
 * Find all the related videos from the Brightcove API.
 * @param {String} id - the video id
 * @param {Object} opts - the related options object
 * @returns {Object} list of videos as an associative array object
 */

var findRelatedVideos = function (id, opts) {
  // return cms.videos.get(id, opts).then(function(resp) {
  //   var video = resp.data;
  //   var searchTerm = video.tags.join(' ') + ' ' + video.description;
  //   var query = ['NOT', {
  //     'id': video.id
  //   }, 'AND', {
  //     'playable': true
  //   }, searchTerm.replace('.', '')];
  //   var q = cms.query.parse(query);
  //   return cms.videos.list({
  //     q: q
  //   }, opts);
  // });
  return [];
};

/**
 * Find videos by id.
 * @param {String} id - the video reference id
 * @param {Object} opts - the related options object
 * @returns {Object} list of videos as an associative array object
 */

// var findVideosByIds = function (ids, opts) {
//   if (!Array.isArray(ids)) {
//     throw new Error(
//       'First argument passed to findVideosByIds must be an array'
//     );
//   }
//   return cms.videos.list(
//     {
//       q: 'id:' + ids.join(' '),
//     },
//     opts
//   );
//   return [];
// };

/**
 * Find videos by reference id.
 * @param {String} refId - the video reference id
 * @param {Object} opts - the related options object
 * @returns {Object} list of videos object
 */

// var findVideoByReferenceId = function (refId, opts) {
//   return cms.videos.list(
//     {
//       q: 'reference_id:' + refId,
//     },
//     opts
//   );
// };

/**
 * Find videos by reference id.
 * @param {String} refId - the video reference id
 * @param {Object} opts - the related options object
 * @returns {Object} list of videos object
 */

// var findVideosByReferenceIds = function (refIds, opts) {
//   if (!Array.isArray(refIds)) {
//     throw new Error(
//       'First argument passed to findVideosByReferenceIds must be an array'
//     );
//   }
//   return cms.videos.list(
//     {
//       q: 'reference_id:' + refIds.join(' '),
//     },
//     opts
//   );
// };

/**
 * Find videos by playlist id.
 * @param {String} refId - the playlist id
 * @param {Object} opts - the related options object
 * @returns {Object} list of videos object
 */

var findPlaylistById = function (id, opts) {
  return cms.playlists.get(id, opts).then(function (resp) {
    if (!resp.data.id || resp.data.video_ids.length === 0) return [];
    return cms.videos
      .list(
        {
          q: 'id:' + resp.data.video_ids.join(' '),
        },
        opts
      )
      .then(function (vresp) {
        //Workaround cms.videos.list: CMS API does not return the expected results when the "playable:true" term is added to the query.
        // instead we fiter out inactive videos in the backend.
        var activeVideos = function (o) {
          return o.state === 'ACTIVE';
        };

        var startedVideos = function (o) {
          if (o.schedule && o.schedule.starts_at) {
            let startsAt = moment(o.schedule.starts_at).unix();
            if (isNaN(startsAt)) return true;
            return moment().unix() >= startsAt;
          } else {
            return true;
          }
        };

        var playableVideos = function (o) {
          return activeVideos(o) && startedVideos(o);
        };
        resp.data.videos = _.filter(vresp.data, playableVideos);
        return resp;
      });
  });
};

/**
 * Find videos by playlist reference id.
 * @param {String} refId - the playlist reference id
 * @param {Object} opts - the related options object
 * @returns {Object} list of videos object
 */

var findPlaylistByReferenceId = function (refId, opts) {
  return cms.playlists
    .list(
      {
        q: 'reference_id:' + refId,
      },
      opts
    )
    .then(function (resp) {
      if (resp.data.length === 0 || resp.data[0].video_ids.length === 0)
        return [];
      return cms.videos
        .list(
          {
            q: 'id:' + resp.data[0].video_ids.join(' ') + ' +playable:true',
          },
          opts
        )
        .then(function (vresp) {
          resp.data.videos = vresp.data;
          return resp;
        });
    });
};

/**
 * Get node cache store.
 * @returns {Object} store
 */

var getStore = function () {
  return store;
};

/**
 * Merge two response data array (without duplicates).
 * @param {Array} respDataA - the raw response's data attribute (ie. resp.data)
 * @param {Array} respDataB - another raw response's data attribute
 * @returns {Array} merged array
 */

var mergeRespData = function (respDataA, respDataB) {
  return _.uniq(respDataA.concat(respDataB), function (obj) {
    return obj.id;
  });
};

/**
 * Merge tagged videos and playlist videos (without duplicates).
 * @param {Object} options - the query options
 * @param {Function} comparator - a compare function that is used for sorting.
 * @param {Number} limit - the number of result to return.
 * @param {Object} opts - the option field to be used by the interceptor.
 * @returns {Object} merged pseudo response (a hash contains data field, which is an array).
 */

var findMergedVideos = function (options, comparator, limit, opts) {
  var query = _.merge({}, options);
  var ids = opts.playlistVideoIds;
  return Promise.all([
    cms.videos.list(query, opts),
    cms.videos.list(
      {
        q: 'id:' + ids.join(' '),
      },
      opts
    ),
  ]).then(function (result) {
    var taggedVideos = result[0].data;
    var playlistVideos = result[1].data;
    var allVideos = mergeRespData(taggedVideos, playlistVideos);
    allVideos.sort(comparator);
    allVideos = allVideos.slice(0, limit);
    var res = {
      data: allVideos,
    };
    return res;
  });
};

/**
 * Find most recent videos.
 * @returns {Object} list of videos object
 */

var findMostRecent = function (options, opts) {
  return findMergedVideos(
    options,
    function (a, b) {
      a = new Date(a.created_at);
      b = new Date(b.created_at);
      return b - a;
    },
    config.numHomeGridVideos,
    opts
  );
};

/**
 * Find most popular videos.
 * @returns {Object} list of videos object
 */

var findMostPopular = function (options, opts) {
  return findMergedVideos(
    options,
    function (a, b) {
      var viewsA = opts.analyticsData[a.id]
        ? opts.analyticsData[a.id].video_view
        : 0;
      var viewsB = opts.analyticsData[b.id]
        ? opts.analyticsData[b.id].video_view
        : 0;
      return viewsB - viewsA;
    },
    config.numHomePopularVideos,
    opts
  );
};

module.exports = {
  getStore: getStore,
  getProjects: cms.projects.list,
  getProject: cms.projects.get,
  getVideos: cms.videos.list,
  getVideo: cms.videos.get,
  searchVideos: cms.videos.search,
  // updateVideo: cms.videos.update,
  // parse: cms.query.parse,
  // getAccessToken: cms.getAccessToken,
  // searchVideos: cms.videos.list,
  // findRelatedVideos: findRelatedVideos,
  // findVideoById: cms.videos.get,
  // findVideoByIdWithoutRating: cms.videos.get,
  // findVideosByIds: findVideosByIds,
  // findVideoByReferenceId: findVideoByReferenceId,
  // findVideosByReferenceIds: findVideosByReferenceIds,
  // findPlaylistById: findPlaylistById,
  // findPlaylistByReferenceId: findPlaylistByReferenceId,
  // findMostRecent: findMostRecent,
  // findMostPopular: findMostPopular,
};

/**
 * Go through each method in the cms API and convert the response
 * to return a new VideoCollection model instead of just raw json
 */
Object.keys(module.exports).forEach(function (method) {
  if (
    [
      // 'parse',
      'getStore',
      // 'updateVideo',
      // 'getAccessToken',
      // 'findVideoByIdWithoutRating',
    ].indexOf(method) >= 0
  ) {
    return;
  }

  /**
   * Rewrite each method in the cms api lib to return a new VideoCollection
   * object instead of a regular json object
   */
  var oldMethod = module.exports[method];
  module.exports[method] = function () {
    return oldMethod
      .apply(null, arguments)
      .then(function (resp) {
        console.log('method: ' + method);

        return new VideoCollection(JSON.parse(resp));
      })
      .catch(function (err) {
        logger.error(err.stack);
        logger.error(err.message);
      });
  };
});

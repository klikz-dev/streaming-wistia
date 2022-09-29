'use strict';

var _ = require('lodash');
var cacheManager=require('cache-manager');
var logger = require('node-logger')(module);
var request = require('request');
var qs = require('query-string');
var md5 = require('md5');
var generaterr = require('generaterr');
var moment = require('moment');

var globalConfig = require('../config');

var API_ENDPOINT = 'https://cms.api.brightcove.com/v1/accounts/';
var MAX_RETRIES = 5;
var MAX_PAGE_SIZE = 100.0;
var playlist_endpoint = '/playlists/';
var videos_endpoint = '/videos/';

module.exports.rcachePage = function(req, res, next) {
  var locale = req.locale;
  logger.debug('locale='+locale);

  var tags = []; //req.taxonomy.tags;
  var playlistVideoIds = []; //req.taxonomy.playlistVideoIds;
  var prefix = '';
  var cmsOpts = {
    encode: true,
    account: req.locale,
    fetch_all: true,
    tags: tags,
    playlistVideoIds: playlistVideoIds,
    analyticsData: req.analyticsData
  };
  if (tags.length === 1) {
    prefix = '+';
  }

  logger.debug('globalConfig cache.opts='+JSON.stringify(globalConfig.cache.opts));
  var store=cacheManager.caching(globalConfig.cache.opts);
  var retry=false;

  logger.debug('store='+JSON.stringify(store));
  if (globalConfig.cache.enabled && globalConfig.cache.opts.store !== 'memory') {
    store.store.events.on('redisError', function(err) {
      logger.error(err);
    });
  }
  var settings = globalConfig.getLocaleSettings(locale);
  logger.debug('settings.cms='+JSON.stringify(settings.cms));
  var account = _.merge({}, settings.cms, { name: locale });

  var featPlistId=settings.featuredVideosPlaylistId;
  var freePlistId=settings.freeVideos.playlistId;
  var plist=settings.playlists;
  logger.debug('settings featPlistId='+featPlistId);
  logger.debug('settings freePlistId='+freePlistId);
  logger.debug('settings plist='+JSON.stringify(plist));
  //featPlistId=null;
  //freePlistId=null;

   var getCacheKey = function(options) {
    var params = JSON.stringify(options.qs || options.body) || '';
    return md5(account.name+options.method+options.url+params);
   };
   var newError = function(name, message) {
   	message = (message || '').replace(/&quot;/g,'"');
   	var Err = generaterr(name);
   	return new Err(message);
   };
   function Token(params) {
   	this.expirationWindow = 10;
   	this.body = params.access_token;
   	this.type = params.token_type;

   	var now = new Date();
   	now.setSeconds(now.getSeconds() + params.expires_in);
   	this.expiration = now;
   }
   Token.prototype = {
   	constructor: Token,

   	/**
   	 * @private
   	 * Specifies whether the token has expired
   	 */
   	isExpired: function() {
   		return (new Date().getTime() - this.expiration.getTime())/1000 + this.expirationWindow >= 0;
   	},

   	/**
   	 * @private
   	 * Renews the token by replacing its body and updating its expiration
   	 * @param {Object} params - the body of a token request
   	 * @returns {Token} with its updated values
   	 */
   	renew: function(params) {
   		this.body = params.access_token;

   		var now = new Date();
   		now.setSeconds(now.getSeconds() + params.expires_in);
   		this.expiration = now;

   		return this;
   	}
   };
  var fetchAccessToken = function(passThrough) {
    var auth_string = new Buffer(account.clientId + ':' + account.clientSecret).toString('base64');

    return new Promise(function(resolve, reject) {
      request({
        method: 'POST',
        url: 'https://oauth.brightcove.com/v3/access_token',
        headers: {
          'Authorization': 'Basic ' + auth_string,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }, function (err, response, body) {
        if(err) return reject(err);

        body = JSON.parse(body);

        if(body.error)
          reject(newError(body.error, body.error_description));
        else {
          if(account.accessToken)
            account.accessToken.renew(body);
          else
            account.accessToken = new Token(body);
          if(passThrough) resolve(passThrough);
          else resolve(true);
        }
      });
    });
  };
  /*
  var getAccessToken = function() {
    if(account.accessToken && !account.accessToken.isExpired())
      return Promise.resolve(account.accessToken);

    return fetchAccessToken().then(function() {
      return account.accessToken;
    });
   }; */
  var retryRequest = function(options) {
    return new Promise(function(resolve, reject) {
      var retryTime = options.retry ? options.retry * 2 : 1 + Math.random()*1000;
      var attempt = options.attempt ? options.attempt + 1 : 1;

      if(attempt > MAX_RETRIES)
        return reject('MaxRetriesError');

      var opts = _.merge({}, options, { retry: retryTime, attempt: attempt });
      setTimeout(function() {
        //logger.debug('retryRequest:opts='+JSON.stringify(opts));
        resolve(makeRequest(opts));
      }, retryTime);
    }.bind(this));
   };
  var makeRequest = function(options) {
    //logger.debug("makeRequest:options="+JSON.stringify(options));
    return new Promise(function(resolve, reject) {
      if(!account.accessToken || account.accessToken.isExpired()) {
        //logger.debug("makeRequest:fetchAccessToken:options="+JSON.stringify(options));
        return resolve(fetchAccessToken(options).then(makeRequest));
      }

    //logger.debug("makeRequest:set auth:options="+JSON.stringify(options));
      options.headers.Authorization = 'Bearer '+account.accessToken.body;
      request(options, function(err, response, body) {
        if(err) {
          return reject('ConnectionError:'+err.message);
        }

        if(response.statusCode === 204) {
          body = {};
        }
        else if(retry && (response.statusCode === 429 || typeof body !== 'object')) {
          return resolve(retryRequest(options));
        }

        if(body.error)
          reject(newError(body.error, body.error_description));
        else if(body instanceof Array && body.length === 1 && body[0].error_code)
          reject(newError(body[0].error_code, body[0].message));
        else {
          var theResponse = {
            statusCode: response.statusCode,
            request: _.pick(response.request, ['href','method']),
            cached: false,
            data: body,
            dataCacheKey:null,
            dataCached:null
          };
          if(store) {
 /***********
            var cachedResponse =  _.merge({}, theResponse, { cached: true });
            config.store.set(getCacheKey(options, account), cachedResponse, function(err) {
              err ? reject(err) :resolve(theResponse);
            });
**************/
             var ckey=getCacheKey(options);
             logger.debug('....makeRequest:ckey='+ckey+',options='+JSON.stringify(options));
             var qckey=req.query.ckey;
             var qrkey=req.query.rkey;
             logger.debug('makeRequest:check cache:ckey='+ckey+',qckey='+qckey+',qrkey='+qrkey);
             store.get(ckey,function(err, value) {
                if(err) {logger.error('makeRequest:error for '+ ckey +':'+err);}
                else {
                  theResponse=_.merge({}, theResponse, { cached: true,dataCacheKey:ckey });
                  if(!value) {
                    logger.warn('makeRequest:no value for '+ ckey +' !!!');
                  }
                  else {
                    logger.debug('makeRequest:cached at '+ckey+':'+value.data.length); //+',value='+JSON.stringify(value));
                    theResponse =  _.merge({}, theResponse, { dataCached:value.data });
                  }
                }
                if(qckey && qrkey && ckey===qckey) {
                  logger.warn('=========makeRequest:set cache for '+ckey+' !!!');
                  store.set(ckey, theResponse);
                }
                resolve(theResponse);
             });
          }
          else
            resolve(theResponse);
        }
        //resolve(theResponse);
      });
    });
  };
  var validate = function(params, validators) {
    var missing = [];
    var vKeys = _.keys(validators);

    if(typeof params !== 'object' || Array.isArray(params)) {
      var p = {};
      p[vKeys[0]] = params;
      params = p;
    }

    var required = vKeys.filter(function(key) {
      return validators[key].required;
    });
    required.forEach(function(req) {
      if(!params[req])
        missing.push(req);
    });

    if(missing.length > 0) {
      var errString = generaterr('MaxRetriesError').replace('{params}', missing.toString());
      return Promise.reject('MissingReqsError:'+errString);
    }

    return validateParams(params, validators);
  };
  var validateParams = function(params, validators) {
    var validationErrs = {};

    for(var param in params) {
      var value = params[param];
      var validator = validators[param];

      if(!validator)
        continue;

      var errs=[];

      // Validate type
      if(validator.type) {
        if(validator.type === 'array' && !Array.isArray(value) ||
          validator.type === 'map' && typeof value !== 'object' ||
          validator.type !=='array' && validator.type !=='map' && typeof value !== validator.type)
          errs.push(generaterr('InvalidParametersError').replace('%p', param).replace('%t', validator.type));
      }

      // Validate value
      if(validator.allowed) {
        if(validator.allowed.indexOf(value) < 0)
          errs.push('\"%p\" doesn\'t take the following value: %v'.replace('%p', param).replace('%v', value));
      }
      if(errs.length > 0)
        validationErrs[param] = errs;
    }

    if(_.keys(validationErrs).length > 0)
      return Promise.reject('InvalidParamsError:'+validationErrs);

    return false;
  };
  var send = function(endpoint, method, params, opts) {
    if(opts && opts.count) {
      var pages = Math.ceil(opts.count/MAX_PAGE_SIZE),
        requests = [];

      for(var i=0, len=pages; i<len; i++) {
        requests.push(sendRequest(endpoint, method, _.merge({ limit: parseInt(MAX_PAGE_SIZE), offset: parseInt(i*MAX_PAGE_SIZE) }, params), opts));
      }
      return Promise.all(requests).then(function(responses) {
        var data = _.flatten(responses.map(function(response) {
          return response.data;
        }));
        return _.merge(responses[0], { data: data });
      });
    }
    return sendRequest(endpoint, method, params, opts);
  };
  var sendRequest = function(endpoint, method, params, opts) {
    var options = {
      url: API_ENDPOINT+account.accountId+endpoint,
      json: true,
      method: method,
      headers: {},
      account: account.name
    };

    if(options.url[options.url.length-1] === '/')
      options.url = options.url.substring(0, options.url.length-1);

    if(['GET', 'DELETE'].indexOf(method) >=0) {
      if(params) {
        options.url += '?';
        if(opts && opts.encode)
          options.url += qs.stringify(params);
        else
          options.url += qs.stringify(params).replace(/%2B/g,'+').replace(/%3A/g,':').replace(/%2C/g,',').replace(/%22/g,'"');
      }
    }
    else if(['POST', 'PATCH', 'PUT'].indexOf(method) >=0) {
      options.body = params;
    }

    //logger.debug("sendRequest:options="+JSON.stringify(options));

    if(store && ((opts && (opts.cache !== false)) || !opts)) {
/*********
      return new Promise(function(resolve, reject) {
        config.store.get(getCacheKey(options, account), function(err, value) {
          if(err)
            reject(err);
          else if(!value) {
            resolve(makeRequest(options));
          }
          else
            resolve(value);
        });
      });
***********/
      logger.debug('sendRequest:cache key='+getCacheKey(options));
      return makeRequest(options);
    }
    else
      return makeRequest(options);
  };
  var playlists_get = function(playlistIds, opts) {
  	var invalid = validate(playlistIds, {
  		playlist_ids: { required: true }
  	});
  	if(invalid)
  		return invalid;

  	if(!(playlistIds instanceof Array))
  		playlistIds = [playlistIds];

  	return send(playlist_endpoint+playlistIds.join(','), 'GET', undefined, opts);
  };
  var videos_counts = function(queryParams, opts) {
  	return send('/counts'+videos_endpoint, 'GET', queryParams, opts);
  };
  var videos_list = function(queryParams, opts) {
  	if(opts && opts.fetch_all) {
  		return videos_counts(queryParams, opts).then(function(resp) {
  			opts = _.merge({}, opts, { count: resp.data.count });
  			return send(videos_endpoint, 'GET', queryParams, opts);
  		});
  	}
  	return send(videos_endpoint, 'GET', queryParams, opts);
  };
  var getPlaylists = function(playlists, carouselItems){
      if(playlists.length === 0) {
        return Promise.resolve(carouselItems);
      }
      var current = playlists[0];
      return findPlaylistById(current.playlistId, cmsOpts).then(function(resp){
        var item = {
          playlistId: current.playlistId,
          title: current.title,
          videos: resp.data.videos,
          cached: resp.data.cached,
          cacheKey: resp.data.cacheKey,
          dataCached: resp.data.dataCached,
          lazyLoadThumbails: true,
          showRating: settings.showRating
        };
        carouselItems.push(item);
        playlists.shift();
        return getPlaylists(playlists, carouselItems);
      });
  };
  var findPlaylistById = function(id, opts) {
    return playlists_get(id, opts).then(function(resp) {
      if (!resp.data.id || resp.data.video_ids.length === 0)
        return [];
      logger.debug('findPlaylistById:id='+id+',video ids='+resp.data.video_ids.length);
      logger.debug('  video ids='+resp.data.video_ids.join(','));
      return videos_list({
        q: 'id:' + resp.data.video_ids.join(' ')
      }, opts).then(function(vresp) {
        //Workaround cms.videos.list: CMS API does not return the expected results when the "playable:true" term is added to the query.
        // instead we fiter out inactive videos in the backend.
        var activeVideos = function(o) {
          return o.state === 'ACTIVE';
        };

        var startedVideos = function(o) {
          if (o.schedule && o.schedule.starts_at) {
            let startsAt = moment(o.schedule.starts_at).unix();
            if (isNaN(startsAt)) return true;
            return moment().unix() >= startsAt;
          } else {
            return true;
          }
        };

        var playableVideos = function(o) {
          return activeVideos(o) && startedVideos(o);
        };
        resp.data.videos = _.filter(vresp.data, playableVideos);
        resp.data.cached = vresp.cached;
        resp.data.cacheKey = vresp.dataCacheKey;
        logger.debug('findPlaylistById:final videos='+resp.data.videos.length);
        logger.debug('findPlaylistById:vresp.dataCached'+vresp.dataCached);
        if(vresp.dataCached) {
          resp.data.dataCached = _.filter(vresp.dataCached, playableVideos);
          logger.debug('findPlaylistById:final cached videos='+resp.data.dataCached.length);
        }
        return resp;
      });
    });
  };

   var qckey=req.query.ckey;
   var qrkey=req.query.rkey;
   if(qckey && !qrkey) {
      logger.debug('=========delete '+qckey+'============');
      store.del(qckey);
   }
    //Call for featured videos, recent and most popular.
    var cplist=_.map(plist, _.clone);
    Promise.all([
      featPlistId ? findPlaylistById(featPlistId, cmsOpts): Promise.resolve([]),
      freePlistId ? findPlaylistById(freePlistId, cmsOpts) : Promise.resolve([]),
      plist.length !== 0 ? getPlaylists(plist, []) : Promise.resolve([])
    ]).then(function(responses) {
    var featured = responses[0].data || [],
      free = responses[1].data || [],
      carouselItems = responses[2];


   logger.debug('after get plist='+JSON.stringify(plist));
   logger.debug('after get cplist='+JSON.stringify(cplist));
   //logger.debug('after get featured='+JSON.stringify(featured));
   logger.debug('after get carouselItems='+carouselItems.length);
   //var ci0=carouselItems[0];
   //logger.debug('after get carouselItem0='+JSON.stringify(ci0));

  var featvids=featured.videos.map(v=>{return v.id;});
  logger.debug('featvids='+JSON.stringify(featvids));
  logger.debug('featured.dataCached='+featured.dataCached);
  if(featured.dataCached) {
     var featcvids=featured.dataCached.map(v=>{return v.id;});
     //var featcvids=["5370119569002","5115612117002","5117043327001"]
     logger.debug('featcvids='+JSON.stringify(featcvids));
     var featdiff=_.difference(featvids,featcvids);
     logger.debug('featdiff='+JSON.stringify(featdiff));
     var featdiff1=_.difference(featcvids,featvids);
     logger.debug('featdiff1='+JSON.stringify(featdiff1));
     featured.diff=featdiff;
     featured.diff1=featdiff1;
      logger.debug('featured diff.length=' + featured.diff.length + ',diff1.length=' + featured.diff1.length);
     featured.ok = !(featured.diff.length > 0 || featured.diff1.length > 0);
        logger.debug(' --->ok='+featured.ok);
   } else {
      featured.diff=featvids;
      featured.ok=false;
   }
   featured.playlistId=featPlistId;
   free.playlistId=freePlistId;

   carouselItems=carouselItems.map(ci=>{
      let vs=ci.videos.map(v=>{return v.id;});
      let vd=vs, vd1=null;
      let ok=false;
      logger.debug('carouselItems:'+ci.playlistId+':dataCached='+ci.dataCached);
      if(ci.dataCached) {
        let vcs=ci.dataCached.map(v=>{return v.id;});
        vd=_.difference(vs,vcs);
        vd1=_.difference(vcs,vs);
        logger.debug(' vd.length='+vd.length+',vd1.length='+vd1.length);
        ok = !(vd.length > 0 || vd1.length > 0);
        logger.debug(' --->ok='+ok);
      }
      return _.merge({},ci,{ok:ok,diff:vd,diff1:vd1});
   });
   res.render('rcache/main', {
      layout: false,
      qs:JSON.stringify(req.query),
      featPlistId:featPlistId,
      freePlistId:freePlistId,
      plist:cplist,
      featured:featured,
      free:free,
      carouselItems:carouselItems
    });

  }).catch(next);
};

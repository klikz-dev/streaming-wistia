'use strict';
/*jshint camelcase: false*/

var logger = require('node-logger')(module);
var _ = require('lodash');
var utils = require('../lib/utils');
var cmsApi = require('../lib/cmsApi');

//var settings = require('../config');
var dbApi = require('../lib/dbApi');
var VideoTracking = require('../models/videoTracking');

module.exports.init = function(req, res,next) {
  logger.info('tracking init:locale=',req.locale);
  logger.info('tracking init:create table tracking');
  var sq='CREATE TABLE IF NOT EXISTS tracking (';
  sq = sq + 'cusid varchar(16) NOT NULL,';
  sq = sq + 'videoid varchar(24) NOT NULL,';
  sq = sq + 'timepoint int(10) NOT NULL,';
  sq = sq + 'favorite BOOLEAN NOT NULL,';
  sq = sq + 'recordat int(24) NOT NULL,';
  sq = sq + 'recordatfmt varchar(36) NOT NULL,';
  sq = sq + 'PRIMARY KEY (cusid, videoid))';
  var q=dbApi.dbquery(sq);
  q.on('result',function(rst) {
    logger.info('tracking init:rst=',rst);
    res.send('tracking init:table tracking created');
  }).on('error',function(err){
    logger.info('tracking init:err=',err);
    next(err);
  });
};

module.exports.addfv = function(req, res,next) {
  logger.info('tracking addfv:locale=',req.locale);
  logger.info('tracking addfv:alter table tracking add favorite');
  var sq='ALTER TABLE tracking ADD ';
  sq = sq + 'favorite BOOLEAN NOT NULL AFTER timepoint';
  var q=dbApi.dbquery(sq);
  q.on('result',function(rst) {
    logger.info('tracking addfv:rst=',rst);
    res.send('tracking addfv:table tracking altered');
  }).on('error',function(err){
    logger.info('tracking addfv:err=',err);
    next(err);
  });
};

module.exports.track = function(req, res,next) {
//  logger.info('track:locale=',req.locale);
//  var config = settings.getLocaleSettings(req.locale);
  var cusid = req.params.cusid;
  var vid = req.query.vid;
  if(!cusid){
    if(!req.isAuthenticated()) {
//      logger.info('track:not authenticated.');
      return res.send('must login or provide cusid');
    }
    if (!res.locals.isAuthorized) {
//      logger.info('track:not authorized.');
    }
    cusid=req.user.id;
  }
  logger.info('track:cusid='+cusid);
  var sql='select * from tracking where cusid=?';
  var qvs = [cusid];
  if(vid) {
    sql = sql + ' and videoid=?';
    qvs.push(vid);
  }
//  logger.info('track:sql='+dbApi.dbformat(sql,qvs));
  dbApi.dbqueryvswcb(sql,qvs,
    function(err,rsts){
      if(err) {
        logger.info('track:err=',err);
        next(err);
      }
//      logger.info('track:trackings='+rsts.length);
//      logger.info('track:results=',rsts);
      res.send(rsts);
    });
};
module.exports.favorite = function(req, res,next) {
  //  logger.info('favorite:locale=',req.locale);
  //  var config = settings.getLocaleSettings(req.locale);
    var cusid = req.params.cusid;
    if(!cusid){
      if(!req.isAuthenticated()) {
  //      logger.info('favorite:not authenticated.');
        return res.send('must login or provide cusid');
      }
      if (!res.locals.isAuthorized) {
  //      logger.info('favorite:not authorized.');
      }
      cusid=req.user.id;
    }
    logger.info('favorite:cusid='+cusid);
    var sql='select * from tracking where cusid=? and favorite IS TRUE';
    var qvs = [cusid];
  //  logger.info('favorite:sql='+dbApi.dbformat(sql,qvs));
    dbApi.dbqueryvswcb(sql,qvs,
      function(err,rsts){
        if(err) {
          logger.info('favorite:err=',err);
          next(err);
        }
  //      logger.info('favorite:trackings='+rsts.length);
  //      logger.info('favorite:results=',rsts);
        res.send(rsts);
      });
  };

module.exports.postFavoriteToggle = function(req, res, next) {
  var customerId = req.params.cusid;
  if (!customerId) {
    if (!req.isAuthenticated()) {
      return res.send('You must login');
    }
    customerId = req.user.id;
  }

  var favorite = new VideoTracking(req.body);

  var sql = 'INSERT INTO tracking (cusid, videoid, timepoint, favorite, recordat, recordatfmt) ' 
          + 'VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ' 
          + 'timepoint=?, favorite=?, recordat=?, recordatfmt=?';
  var values = [
    customerId,
    favorite.videoid,
    favorite.timepoint,
    favorite.favorite,
    favorite.recordedAt,
    favorite.recordedAtFormatted,
    favorite.timepoint,
    favorite.favorite,
    favorite.recordedAt,
    favorite.recordedAtFormatted
  ];

  var query = dbApi.dbqueryvs(sql, values);
  query.on('error', function(err) {
    next(err);
  }).on('end', function() {
    res.send('postTrack:done with '+req.body);
  });
};

module.exports.postTrack = function(req, res,next) {
//  logger.info('postTrack:locale=',req.locale);
//  var config = settings.getLocaleSettings(req.locale);
  var cusid = req.params.cusid;
  if(!cusid){
    if(!req.isAuthenticated()) {
        logger.info('postTrack:not authenticated.');
        return res.send('must login or provide cusid');
    }
//    logger.info('postTrack:user=',req.user);
    if (!res.locals.isAuthorized) {
//      logger.info('postTrack:not authorized.');
    }
    cusid=req.user.id;
  }
//  logger.info('postTrack:cusid=',cusid);
  logger.info('postTrack:req body=',req.body);
  var t=new VideoTracking(req.body);
  var sql='insert into tracking(cusid,videoid,timepoint,favorite,recordat,recordatfmt) values(?,?,?,?,?,?)';
  sql = sql + ' ON DUPLICATE KEY UPDATE ';
  sql = sql + 'timepoint=?, favorite=?, recordat=?, recordatfmt=?';
  var qvs = [cusid,t.videoid,t.timepoint,t.favorite,t.recordedAt,t.recordedAtFormatted,
    t.timepoint,t.favorite,t.recordedAt,t.recordedAtFormatted];
  logger.info('postTrack:qvs=',qvs);
  logger.info('postTrack:sql='+dbApi.dbformat(sql,qvs));
  var q=dbApi.dbqueryvs(sql,qvs);
  q.on('result',function() {
//    logger.info('postTrack:rst=',rst);
  }).on('error',function(err){
    logger.info('postTrack:err=',err);
    next(err);
  }).on('end', function() {
    res.send('postTrack:done with '+req.body);
  });
};

module.exports.getMyFavorites = function(req, res, next) {
  var context = {
    pageTitle: req.__('My Favorites'),
    title: req.__('My Favorites'),
  };
  var cusid=req.user.id;
  logger.info('getMyFavorites:cusid='+cusid);
  var sql='select * from tracking where cusid=? and favorite IS TRUE';
  var qvs = [cusid];
  //  logger.info('getMyFavorites:sql='+dbApi.dbformat(sql,qvs));
  dbApi.dbqueryvs_promise(sql,qvs)
    .then((rsts)=>{
      //      logger.info('getMyFavorites:trackings='+rsts.length);
      //      logger.info('getMyFavorites:results=',rsts);
      var ids = rsts.map((t)=>t.videoid);
      logger.info('getMyFavorites:ids=',ids);
      var opts={};
      return cmsApi.findVideosByIds(ids, opts)
        .then((videos) => {
          return videos.data.map(v=>{return _.merge(v,{slug: utils.makeSlug(v.name)});});
        })
        .catch((err)=>{
          logger.error('getMyFavorites:findVideosByIds error:',err);
          throw new Error('findVideosByIds error:'+err.message);
        });
    })
    .then((videos)=>{
      logger.info('getMyFavorites:videos=',videos.length);
      res.render('my-favorites/main', _.merge(context, {videos:videos}));
    })
    .catch((err)=> {
          logger.info('getMyFavorites:err=',err);
          next(err);
    });
};

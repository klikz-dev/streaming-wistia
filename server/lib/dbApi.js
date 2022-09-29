'use strict';

var logger = require('node-logger')(module);

var config = require('../config').getLocaleSettings();
var mysql = require('mysql');

logger.info('config.db=',config.db);
var dbconn = null;
var startConnection = function() {
  logger.info('DB CONNECTING');
  dbconn = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.pswd,
    database : config.db.db
  });
  dbconn.connect(function(err) {
      if (err) {
        logger.error('DB CONNECT FAILED:', err);
        startConnection();
      }
      else {
        logger.info('DB CONNECTED');
      }
  });
  dbconn.on('error', function(err) {
    logger.error('DB CONNECTION ERROR:', err);
    if (err.fatal) {   //err.code === 'PROTOCOL_CONNECTION_LOST'
        startConnection();
    }
  });
};
startConnection();

var dbconnect = function() {
  return dbconn;
};
var dbescapestr = function(v) {
  return dbconn.escape(v);
};
//var sql = "SELECT * FROM ?? WHERE ?? = ?";
//var qvs = ['users', 'id', userId];
var dbformat = function(sql,qvs) {
  return mysql.format(sql,qvs);
};
var dbquerywcb = function(sql,rcb) {
  dbconn.query(sql,rcb);
};
//rcb: function (error, results, fields)
var dbqueryvswcb = function(sql,qvs,rcb) {
  dbconn.query(sql,qvs,rcb);
};

var dbquery = function(sql) {
  return dbconn.query(sql);
};
var dbqueryvs = function(sql,qvs) {
  return dbconn.query(dbformat(sql,qvs));
};
var dbqueryvs_promise = function(sql,qvs) {
  return new Promise( ( resolve, reject ) => {
    dbconn.query(sql,qvs,( err, rows ) => {
      if ( err )
          return reject( err );
      resolve( rows );
    });
  });
};
module.exports = {
  dbconnect: dbconnect,
  dbescapestr: dbescapestr,
  dbformat: dbformat,
  dbquerywcb: dbquerywcb,
  dbqueryvswcb: dbqueryvswcb,
  dbquery: dbquery,
  dbqueryvs: dbqueryvs,
  dbqueryvs_promise: dbqueryvs_promise,
 };

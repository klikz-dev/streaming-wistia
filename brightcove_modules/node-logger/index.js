'use strict';

var merge = require('lodash.merge');
var winston = require('winston');
var config = {
  level: 'http',
  rootDir: 'server',
  winston: {}
};

var getLabel = function(callingModule) {
  var parts = callingModule.filename.split('/');
  var index = parts.length - 1;
  while(index > 0 && parts[index] !== config.rootDir) {
    index -= 1;
  }
  return parts.slice(index + 1).join('/');
};

module.exports = function(callingModule) {
  return new winston.Logger(merge({
    transports: [new (winston.transports.Console)({
      colorize: false,
      prettyPrint: true,
      timestamp: true,
      level: config.level,
      label: getLabel(callingModule),
      stderrLevels: ['error']
    })],
    levels: {
      http: 1,
      debug: 2,
      info: 3,
      warn: 4,
      error: 5
    },
    colors: {
      http: 'cyan',
      debug: 'magenta',
      info: 'green',
      warn: 'yellow',
      error: 'red'
    }
  }, config.winston));
};

module.exports.init = function(cfg) {
  config = merge(config, cfg || {});
};

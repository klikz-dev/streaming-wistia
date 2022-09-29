'use strict';
var controllers = require('../controllers');

module.exports.init = function(router) {
  //GET
  router.get('/user/login', controllers.sso.login);
  router.get('/verify', controllers.sso.authenticate);
  router.get('/user/logout', controllers.sso.logout);
};
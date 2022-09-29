'use strict';

var controllers = require('../controllers');
var passport = require('passport');
var restrict = require('../middleware').restrict;
var disqus = require('../lib/disqus');

module.exports.init = function(router) {
  //GET
  router.get('/user/login', controllers.auth.getLogin);
  router.get('/user/login/disqus', disqus.loginPopup);
  router.get('/user/login/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));
  router.get('/user/login/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/user/login'
  }), controllers.auth.getRegisterFacebookCallback);
  router.get('/user/register', controllers.auth.getRegister);
  router.get('/user/logout', controllers.auth.getLogout);
  router.get('/user/recover', controllers.auth.getRecover);
  router.get('/user/reset/:slug', controllers.auth.getResetPassword);
  router.get('/user/account', restrict, controllers.auth.myAccount);
  //POST
  router.post('/user/login', controllers.auth.postLogin);
  router.post('/user/register', controllers.auth.postRegister);
  router.post('/user/recover', controllers.auth.postRecover);
  router.post('/user/reset', controllers.auth.postResetPassword);
  router.post('/user/account', restrict, controllers.auth.myAccount);
  router.post('/user/rate', restrict, controllers.detail.postRateContent);
};
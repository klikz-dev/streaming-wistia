'use strict';

var logger = require('node-logger')(module);
var encryption = require('../encryption/ASCDSSOEncryption');
var config = require('../config');
var sso = require('../lib/ssoApi');
var User = require('../models/user');
var utils = require('../lib/utils');
var stripe = require('node-stripe');

var login = function(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect(config.sso.loginURL);
    //return res.redirect('/verify?cdata=' + '6kiPm2VWfT6HHV9AfAb62T7UbK%2b858DBWCF0kVOrFktKh8YsZWMPUAEQN%2b%2bD5uTbgppqoDM4Iz8JYCmqESGtDcIwZLlf%2bCmm75JA5avOEW%2bpHDObYyyGjJenEbXpQyX9m4oWbKHeMDJBrQrqIvQ5yPEO%2bWaThzYwr993oKV64wlX%2b0TMxLm7jZ8bxEekXjM5VyFngpFkFwwVUzA0fUXEOKyYHMDccVEN');
    //return res.redirect('/verify?cdata=' + encodeURIComponent('6kiPm2VWfT5qOkHDIRchx+/9WXDVOPVhWCF0kVOrFksTBuvdtRh6l2Jxk903uoytZaEendkoyeD+PxouI2HLqGPmohA82ABu6bITuNbm+1ceg77Ztp/+/ioDBl7wYElay2Yq8tLyo25qFFcboF1dNF1yMkM7CcTYT/wdJ7P1vSAO0SV7dtIzz0pwH0OSqaxW9AXGgpRxXr19ggrzTLrKk3ojAH9stDlz1TxTYBva33U='));
  } else {
    return res.redirect('/');
  }
};

var logout = function(req, res) {
  req.logout();
  return res.redirect(config.sso.logoutURL);
};

var authenticate = function(req, res, next) {
  if (typeof req.query.cdata === 'undefined' || typeof req.query.cdata !== 'string') {
    return res.redirect(config.sso.loginURL);
  }
  var rawUser = utils.paramStrToObj(encryption.decrypt(req.query.cdata));
  rawUser = utils.lowerCaseKeyForObj(rawUser);
  var user = new User(rawUser);
  var loginWithUser = function(user) {
    req.login(user, function(err) {
      if (err) {
        logger.error(err);
      }

      if(req.query.returnUrl)
        return res.redirect(decodeURIComponent(req.query.returnUrl));
      
      return res.redirect('/');
    });
  };

  if (!user.isValid) {
    logger.error('Invalid User');
    return res.redirect(config.sso.loginURL);
  }

  if (user.get('metadata').stripeUserId === '') {
    return stripe.api.createCustomer({
      email: user.get('email')
    }).then(function(cust) {
      user.setStripeUserId(cust.id);
      return sso.updateStripeId(user.id, user.get('metadata').stripeUserId);
    }).then(function() {
      return loginWithUser(user);
    }).catch(next);
  }
  return loginWithUser(user);
};

module.exports = {
  login: login,
  logout: logout,
  authenticate: authenticate
};

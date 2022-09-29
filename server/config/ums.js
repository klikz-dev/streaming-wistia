'use strict';

var _ = require('lodash');
var ums = require('node-ums');
var stripe = require('node-stripe');

/*
After init is complete, register an afterCreate hook on the User model
to automatically sync the user to Stripe
*/

var oldInit = ums.init;
ums.init = function() {
  return oldInit.apply(null, arguments).then(function() {
    ums.models.User.afterCreate(function(user, opts) {
      return stripe.api.createCustomer({
        email: user.get('email')
      }).then(function(cust) {
        var metadata = _.merge({}, user.get('metadata'), {
          stripeUserId: cust.id
        });

        return user.update({
          metadata: metadata
        }, {
          transaction: opts.transaction
        });
      });
    });
  });
};


//Check to make sure the user has a Stripe account during login
var oldLogin = ums.api.login;
ums.api.login = function() {
  return oldLogin.apply(null, arguments).then(function(user) {
    if (user.role === 'admin') {
      return user;
    }

    var stripeUserId = user.metadata.stripeUserId;

    if (!stripeUserId) {
      throw new Error('User does not have a Stripe account association');
    }

    return stripe.api.getCustomerById(stripeUserId).then(function(cust) {
      if (!cust) {
        throw new Error('User does not exist in Stripe');
      }

      return user;
    });
  });
};

// Change a user's Stripe email when their UMS email changes
var oldChangeEmail = ums.api.changeEmail;
ums.api.changeEmail = function() {
  oldChangeEmail.apply(null, arguments).then(function(userAttrs) {
    return stripe.lib.customers.update(userAttrs.metadata.stripeUserId, {
      email: userAttrs.email
    }).then(function() {
      return userAttrs;
    });
  });
};

module.exports = ums;

'use strict';

var _ = require('lodash');

var VALIDKEYS = [
  'membership_id',
  'first_name',
  'last_name',
  'email_address',
  'role',
  'stripeid',
  'timestamp'
];

var MAX_NAME_LEN = 14;

var ROLE = {
  Admin: 'admin',
  User: 'user'
};

var isValidUser = function(user) {
  var existingKeys = Object.keys(user);
  for (var i = 0; i < VALIDKEYS.length; i++) {
    if (_.indexOf(existingKeys, VALIDKEYS[i]) !== -1) {
      continue;
    } else {
      return false;
    }
  }
  return true;
};

var getShortenedName = function(user) {
  if(user.first_name.length + user.last_name.length <= MAX_NAME_LEN){
    return user.first_name + ' ' + user.last_name;
  } else if(user.first_name.length <= MAX_NAME_LEN) {
    return user.first_name;
  } else if(user.last_name.length <= MAX_NAME_LEN) {
    return user.last_name;
  } else {
    return user.first_name.charAt(0) + user.last_name.charAt(0);
  }
};

function User(user) {
  this.set = function(attr, val) {
    this[attr] = val;
  };

  this.get = function(attr) {
    return this[attr];
  };

  this.metadata = {};
  this.isValid = isValidUser(user);
  if (!this.isValid) {
    return;
  }
  this.id = user.membership_id;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email_address;
  this.role = ROLE[user.role];
  this.isMember = user.ismember==='True' || user.ismember==='1';
  this.nickname = getShortenedName(user);
  this.metadata.stripeUserId = user.stripeid;
  this.metadata.timestamp = user.timestamp;
}

User.prototype = {
  constructor: User,

  setStripeUserId: function(id) {
    this.get('metadata').stripeUserId = id;
  }
};

module.exports = User;

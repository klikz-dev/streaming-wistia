'use strict';

var generaterr = require('generaterr');

[
  'AlreadySubscribedError',
  'PlanDoesNotExistError',
  'CouponDoesNotExistError',
  'NotSubscribedError',
  'InvalidTVODPlanCurrency',
  'PlanInactiveError',
  'NoCardSourceError'
].forEach(function(type) {
  module.exports[type] = generaterr(type);
});

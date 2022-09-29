/*jshint camelcase:false, latedef:false*/
'use strict';

var moment = require('moment');
var _ = require('lodash');
var lib = require('./index')();

function BaseModel(attrs) {
  _.merge(this, attrs);
  _.merge(this, attrs.metadata);
  delete this.metadata;
}


function Plan(attrs) {
  if(attrs instanceof Plan) {
    throw new Error('Tried to create a new Plan object from an existing Plan!');
  }

  BaseModel.call(this, attrs);
  this.tags = _.compact((this.tags || '').split(','));
  this.media_api_tags = this.tags.map(function(tag) {
    return 'tag:' + tag;
  });
  this.videos = _.compact((this.videos || '').split(',').map(function(id) {
    return parseInt(id, 10);
  }));
  this.amount_formatted = (this.amount / 100).toFixed(2);
  this.amount_tvod = parseInt(this.tvod_amount, 10);
  this.tvod_amount_formatted = (this.tvod_amount / 100).toFixed(2);
  this.currency = this.currency.toUpperCase();
  this.active = this.active === 'true';
  this.all_videos = this.all_videos === 'true';
  this.subscriber_count = parseInt(this.subscriber_count, 10);
  this.default_coupon = this.default_coupon === '0' ? undefined: this.default_coupon;
  this._setCurrencyReadable();

  if(this.subscription) {
    this.subscription = new Subscription(this.subscription);
  }
}

Plan.prototype._setCurrencyReadable = function() {
  var coupon = this.default_coupon;
  var templateName = coupon ? coupon.duration : 'forever';
  var compiled = _.template(lib.opts.templates.currency[this.isSVOD() ? templateName : 'tvod']);
  var context = {
    currencySymbol: lib.opts.currencySymbolMap[this.currency.toLowerCase()],
    amount: this.isSVOD() ? this.amount_formatted : this.tvod_amount_formatted,
    currency: this.currency,
    interval_count: this.interval_count === 1 ? '' : this.interval_count,
    interval: this.interval_count > 1 ? (this.interval + 's') : this.interval,
  };

  // TODO: Determine how coupons affect recurring costs and stuff
  if(coupon && coupon instanceof Coupon) {
    context.discountAmount = coupon.getDiscount(this).toFixed(2);
    context.expiration = moment(coupon.expiration).format('MMM DD, YYYY');
  }

  this.currencyReadable = compiled(context);
};

Plan.prototype.setDefaultCoupon = function(coupon) {
  if(coupon && !(coupon instanceof Coupon)) {
    throw new Error('Argument passed to setDefaultCoupon must be a Coupon model');
  }

  this.default_coupon = coupon;
  this._setCurrencyReadable();
};

Plan.prototype.isSVOD = function() {
  return ('type' in this) && this.type === 'svod';
};

Plan.prototype.isTVOD = function() {
  return ('type' in this) && (this.type.indexOf('tvod') > -1);
};

Plan.prototype.isRental = function() {
  return ('type' in this) && this.type === 'tvod_rental';
};

Plan.prototype.hidePricingDescription = function() {
    return ('hide_pricing_description' in this) && this.hide_pricing_description == 'true';
}
Plan.prototype.hasVideos = function() {
    return ('videos' in this) && this.videos.length;
}

function Subscription(attrs) {
  BaseModel.call(this, attrs);
  this.periodEndFormatted = moment.unix(this.current_period_end).format('MMMM D, YYYY');
  this.startedAtFormatted = moment.unix(this.current_period_start).format('MMMM D, YYYY');  

  if(this.plan) {
    this.plan = new Plan(this.plan);
  }

  if(this.canceled_at) {
    this.canceledAtFormatted = moment.unix(this.canceled_at).format('MMMM D, YYYY');
    this.isCanceled = true;
  }
}

Subscription.prototype.isActive = function() {
  return ['canceled', 'unpaid'].indexOf(this.status) === -1;
};


function Card(attrs) {
  BaseModel.call(this, attrs);
  this.brand = this.brand.toLowerCase();
  this.cardMask = new Array(13).join('*') + ' ' + this.last4;
  this.cvvMask = new Array(this.brand === 'american express' ? 5 : 4).join('*');
}


function Customer(attrs) {
  BaseModel.call(this, attrs);
  this.hasCardOnFile = !!this.default_source;

  if(this.hasCardOnFile) {
    this.defaultCard = new Card(_.findWhere(this.sources.data, {
      id: this.default_source
    }));
  }

  this.subscriptions = this.subscriptions.data.map(function(sub) {
    return new Subscription(sub);
  });
}


function Coupon(attrs) {
  BaseModel.call(this, attrs);
  this.valid = this.valid === 'true';
  this.type = attrs.amount_off ? 'amount' : 'percent';
  this.times_redeemed = parseInt(this.times_redeemed, 10);
  this.created = new Date(parseInt(this.created, 10)*1000);
  this.redeem_by = this.redeem_by ? new Date(parseInt(this.redeem_by, 10)*1000) : undefined;

  if(this.duration === 'repeating') {
    this.duration_in_months = parseInt(this.duration_in_months, 10);
    this.duration_by = new Date(this.created.getFullYear(),
                                this.created.getMonth()+this.duration_in_months,
                                this.created.getDate());
  }

  if(this.type === 'amount') {
    this.amount_off = (this.amount_off / 100).toFixed(2);
    this.currency = this.currency.toUpperCase();
  }
  else {
    this.percent_off = parseInt(this.percent_off, 10);
  }

  if(this.redeem_by || this.duration_by) {
    if(!this.duration_by)
      this.expiration = this.redeem_by;
    else if(!this.redeem_by)
      this.expiration = this.duration_by;
    else
      this.expiration = (this.duration_by < this.redeem_by) ? this.duration_by : this.redeem_by;
  }
}

Coupon.prototype.getDiscount = function(plan) {
  var amount = plan.amount / 100;

  if(this.type === 'amount')
    return Math.max(amount - this.amount_off, 0);
  else
    return Math.max(amount - (amount * (this.percent_off/100)), 0);
};

module.exports.Plan = Plan;
module.exports.Subscription = Subscription;
module.exports.Customer = Customer;
module.exports.Coupon = Coupon;

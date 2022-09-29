/*jshint camelcase:false*/
'use strict';

var lib = require('./index')();
var models = require('./models');
var errors = require('./errors');
var utils = require('./utils');
var _ = require('lodash');
var stripe = lib.stripe;
var jquery = require('jquery-deferred');

var debug = function() {
  if(lib.opts.debug) {
    console.log.apply(console, arguments);
  }
};

const MAX_RETRIES = lib.opts.max_retries;

/**
 * Return a specific coupon given its id.
 * @param {String} id - coupon ID
 * @returns {Promise} resolves with a Coupon model
 */
var getCouponById = function(id) {
  return stripe.coupons.retrieve(id).then(function(coupon) {
    return new models.Coupon(coupon);
  }).catch(function(err) {
    if(err.type === 'StripeInvalidRequest') {
      throw new errors.CouponDoesNotExistError(err.message)
    }

    throw err;
  });
};

/**
 * Increment or decrement the subscriber count associated with a plan.
 * @param {String} planId - ID of the plan
 * @param {Number} num - number modifier (1 for increment, -1 for decrement)
 * @returns {Promise} that resolves with whatever the original response was passed into this function
 */
var modifyPlanSubCount = function(planId, num) {
  return function(resp) {
    return new Promise(function(resolve, reject) {
      getPlanById(planId).then(function(plan) {
        plan.subscriber_count += num;
        return plan;
      }).then(function(plan) {
        return stripe.plans.update(plan.id, {
          metadata: {
            subscriber_count: plan.subscriber_count
          }
        });
      }).then(function() {
        resolve(resp);
      });
    });
  };
};

/**
 * Retrieve a list of all plans in the account
 * @param {Object} opts - options object
 * @param {Boolean} opts.active - whether or not to return only active plans
 * @returns {Promise}
 */
var getAllPlans = function(opts) {
  var $defPlans = jquery.Deferred();
  var $defCoupons = jquery.Deferred();
  opts = _.merge({ active: false }, opts || {});
  var stripeParams = {
    limit: 100
  };

  var allplans_ = []; //since we are getting the plans in pages, this array will store them all
  var failsafe_ = 0; //since we have recursive callbacks here, let's make sure we don't get into an endless loop

  var allcoupons_ = []; //since we are getting the coupons in pages, this array will store them all
  var failsafeCoupons_ = 0; //since we have recursive callbacks here, let's make sure we don't get into an endless loop

  //stripe api only returns a finite list and flags for more.  This gets them all in a recursive callback
  var getPlanListSegment_ = function(starting_after, callback) {

    var params = JSON.parse(JSON.stringify(stripeParams));

    //stripe gets the next page of data by flagging where you want to start after.
    if (typeof starting_after === 'string') {
      params.starting_after = starting_after;
    }

    stripe.plans.list(params, function(err, data) {

      if (err || typeof data !== 'object') {
        return callback(err, allplans_);
      }

      allplans_ = allplans_.concat(data.data); //append the plans we got to our overall array

      /*console.log('--- ALL PLANS ---');
      console.log(allplans_);*/

      if (failsafe_++ <= 100 && allplans_.length > 0 && allplans_[allplans_.length - 1].id && data.has_more) {
        console.log('---- NEW PLAN ITERATION ----');
        console.log('---- STARTING_AFTER ID: ') + allplans_[allplans_.length - 1].id;
        getPlanListSegment_(allplans_[allplans_.length - 1].id, callback);

      } else {
        console.log('---- RUNNING PLAN CALLBACK ----');
        callback(err, allplans_);

      }

    });
  };

  //stripe api only returns a finite list and flags for more.  This gets them all in a recursive callback
  var getCouponListSegment_ = function(starting_after, callback) {

    var params = JSON.parse(JSON.stringify(stripeParams));

    //stripe gets the next page of data by flagging where you want to start after.
    if (typeof starting_after === 'string') {
      params.starting_after = starting_after;
    }

    stripe.coupons.list(params, function(err, data) {

      if (err || typeof data !== 'object') {
        return callback(err, allcoupons_);
      }

      allcoupons_ = allcoupons_.concat(data.data); //append the coupons we got to our overall array
      console.log('--- ALL COUPONS ---');
//      console.log(allcoupons_);

      if (failsafe_++ <= 100 && allcoupons_.length > 0 && allcoupons_[allcoupons_.length - 1].id && data.has_more) {
        getCouponListSegment_(allcoupons_[allcoupons_.length - 1].id, callback);

      } else {
        callback(err, allcoupons_);
      }

    });
  };

  //let's get all the plans and coupons...
  getPlanListSegment_(undefined, function(err, data) {
    if (err) {
      console.log('---- PLAN FAILED!! ----');
      console.log(err);
      $defPlans.fail(err);
      return err;
    }

    //plans final result
    console.log('---- PLANS READY ----');
    $defPlans.resolve(data);
    return data;
  });

  getCouponListSegment_(undefined, function(err, data) {
    if (err) {
      $defCoupons.fail(err);
      return err;
    }

    //plans final result
    $defCoupons.resolve(data);
    console.log('---- COUPONS READY ----');
    return data;
    });

    /*return jquery.when($defPlans, $defCoupons)
      .done(function(dataPlans, dataCoupons){*/
    return Promise.all([$defPlans, $defCoupons]).then(function(results){
        console.log('---get all plans RESULTS ---');
        //console.log(results);
        var plans = results[0],
        coupons = results[1],
        couponMap = {};

        /*console.log('---- ALL READY ----');
        console.log('---- PLAN COUNT ----');
        console.log(dataPlans.length);
        console.log('---- COUPONS ----');
        console.log(dataCoupons);
*/
        /*var plans = dataPlans;
        var coupons = dataCoupons;

        var couponMap = {};*/

        coupons.forEach(function(coupon) {
          couponMap[coupon.id] = new models.Coupon(coupon);
        });

        return plans.map(function(attrs) {
          var planModel = new models.Plan(attrs);
          var coupon = couponMap[planModel.default_coupon];
          planModel.setDefaultCoupon(coupon);
          //console.log('PLAN MODEL');
          //console.log(planModel);
          return planModel;
        }).filter(function(plan) {
          return opts.active ? plan.active : true;
        });
    });
  };

/**
 * Get all plans in the account with subscription data a customer ID
 * @param {String} custId - customer ID to find subscriptions for
 * @param {Object} opts - options to pass to getAllPlans()
 * @returns {Promise} promise that resolves with an array of plans
 */
var getAllPlansWithSubscriptions = function(custId, opts) {
  return Promise.all([
    getAllPlans(opts),
    getCustomerById(custId)
  ]).then(function(results) {
    var plans = results[0];
    var cust = results[1];

    return plans.map(function(plan) {
      plan.subscription = null;

      for (var i = 0, len = cust.subscriptions.length; i < len; i++) {
        var sub = cust.subscriptions[i];

        if(sub.plan.id === plan.id) {
          plan.subscription = sub;
          break;
        }
      }

      return plan;
    });
  });
};

/**
 * Retrieve plans that match one or more tags/video ID, or plans that
 * provide access to all videos
 * @param {Array} tags - array of one or more tags to match against.
 * @param {Number|String} videoId - ID of a video
 * @param {Object} opts - options to pass to getAllPlans()
 * @returns {Promise}
 */
var getPlansByTagOrVideoId = function(tags, videoId, opts) {
  console.log(' --- GETTING INTO getAllplans --- ');
  return getAllPlans(opts).then(function(plans) {
    return plans.filter(function(plan) {
      var ret = false;

//      console.log('TAGS: ' + plan.tags);
//      console.log('Videos: ' + plan.videos);

      if(tags && plan.tags) {
        debug('Checking access to plan:', plan.id, 'for video tags:', tags);
        ret =  _.intersection(plan.tags, tags).length > 0;
      }
      if(!ret && videoId && plan.videos) {
        debug('Checking access to plan:', plan.id, 'for video id:', videoId);
        ret =  plan.videos.indexOf(parseInt(videoId, 10)) > -1;
      }
      if(plan.all_videos) {
        ret = true;
      }
      if(!ret) {
        debug('No plans match the tags/video ID');
      }

      return ret;
    });
  });
};


/**
 * Return a specific plan given its id.
 * @param {String} id - plan ID
 * @param {Object} opts - options
 * @param {Boolean} opts.active - whether or not to return only active plans
 * @returns {Promise} resolves with a Plan model
 */
var getPlanById = function(id, opts) {
  opts = _.merge({ active: false }, opts || {});

  return stripe.plans.retrieve(id).then(function(plan) {
    return new models.Plan(plan);
  }).then(function(plan) {
    if(opts.active && !plan.active) {
      throw new errors.PlanInactiveError;
    }
    if(!plan.default_coupon) {
      return plan;
    }

    return getCouponById(plan.default_coupon).then(function(coupon) {
      plan.setDefaultCoupon(new models.Coupon(coupon));
      return plan;
    });
  }).catch(function(err) {
    if(err.type === 'StripeInvalidRequest') {
      throw new errors.PlanDoesNotExistError(err.message)
    }

    throw err;
  });
};

/**
 * Get all plans that a customer is subscribed to, including the
 * subscription DTO.
 * @param {String} custId - ID of the custoemr
 * @returns {Promise} that resolves with an array of Plan models
 */
var getSubscribedPlansForCustomer = function(custId) {
  var stripeOpts = { limit: 100};
  return getAllPlansWithSubscriptions(custId, stripeOpts).then(function(plans) {
    return plans.filter(function(plan) {
      return !!plan.subscription;
    });
  });
};

/**
 * Get a customer's subscription to a plan
 * @param {String} custId - customer id
 * @param {String} planId - planId id
 * @returns {Promise} that resolves with a new Subscription model
 */
var getSubscription = function(custId, planId) {
  return getCustomerById(custId).then(function(cust) {
    var sub = _.findWhere(cust.subscriptions, {
      plan: { id: planId }
    });

    if(!sub) {
      throw new errors.NotSubscribedError();
    }

    return sub;
  });
};

/**
 * Return a specific customer by id
 * @param {String} custId - ID of the customer
 * @returns {Promise} that resolves with a Customer model
 */
var getCustomerById = function(custId) {
  debug('----getCustomerById---',custId);
  return stripe.customers.retrieve(custId).then(function(cust) {
//    debug('  get customer=',cust);
    if('deleted' in cust) {
      return null;
    }

    return cust ? new models.Customer(cust) : null;
  }).catch(function(err) {
    debug('failed to get customer',custId,err);
  });
};

/**
 * Create a new customer.
 * @param {Object} attrs
 * @param {String} attrs.email - user's email address
 * @param {String} attrs.objectId - ID of the user in the main UMS
 * @returns {Promise}
 */
var createCustomer = function(attrs) {
  return stripe.customers.create({
    email: attrs.email,
    metadata: {
      foreignKey: attrs.objectId
    }
  });
};

/**
 * Determine if a user has an active subscription to any plans that intersect
 * a video's array of tags, or to a specific video ID.
 * @param {Object} video
 * @param {String|Number} video.id - ID of the video
 * @param {Array} video.tags - an array of tags (optional)
 * @param {String} custId - Stripe customer ID
 * @returns {Promise} that resolves with a boolean flag denoting authorization
 */
var hasSubscriptionToVideo = function(video, custId) {
  return getCustomerById(custId).then(function(cust) {
    var activeSubs = cust.subscriptions.filter(function(sub) {
      return sub.isActive();
    });

    // Check if the package allows access to all videos
    if(_.findWhere(activeSubs, {
      plan: {
          all_videos: true
      }
    })) {
      return true;
    }

    // CHeck tags
    if(video.tags) {
      // Gather an array of tags that this user has access to
      var subscribedTags = _.uniq(_.flatten(activeSubs.map(function(sub) {
        return sub.plan.tags;
      })));

      if(_.intersection(video.tags, subscribedTags).length > 0) {
        return true;
      }
    }

    // Check video IDs
    var subscribedVideos = _.uniq(_.flatten(activeSubs.map(function(sub) {
      return sub.plan.videos;
    })));

    if(subscribedVideos.indexOf(parseInt(video.id, 10)) > -1) {
      return true;
    }

    return false;
  });
};

/**
 * Check if a user is already subscribed to a plan.
 * @param {Number} planId - id of a plan
 * @param {String} custId - Stripe customer ID
 * @returns {Promise} that resolves with a boolean flag denoting authorization
 */
var hasSubscriptionToPlan = function(planId, custId) {
  debug('---hasSubscriptionToPlan---',planId,custId);
  return getCustomerById(custId).then(function(cust) {
    debug('  get customer=',cust);
    var subs = cust.subscriptions;
    if (Array.isArray(subs)) {
      return subs.filter(function(sub) {
        return sub.plan.id === planId;
      }).length > 0;
    } else {
      return false;
    }
  }).catch(function(err) {
    debug('Error finding customer (' + custId + ') subscription plan (' + planId + ') ', err);
    return false;
  });
};

/**
 * Subscribe a customer to a plan.
 * @param {String} custId - the customer id
 * @param {String} planId - the plan to subscribe to
 * @param {String} stripeToken - token generated through Stripe.js
 * @returns {Promise}
 */
var subscribe = function(custId, planId, stripeToken, opts) {
  /**
  * Fullfills one-time purchases and rents.
  */
  //TODO: Make the subscription atomic more robust and less prone to failure. if one part of the
  // transaction fails, then the entire transaction fails, and the subscription state is left unchanged
  // (i.e if the creation of the subscription fails the customer should not be charged)
  // implement a mechanism to retry a failed operation in case it might succeed on a subsequent attempt.
  var purchasePlan = function(plan) {
    debug('TVOD: creating a charge for plan', plan);

    if(plan.amount > 0) {
      throw new errors.InvalidTVODPlanCurrency();
    }

    return getCustomerById(custId).then(function(cust) {
      if(!stripeToken && !cust.default_source) {
        throw new NoCardSourceError();
      } else if(stripeToken && !cust.default_source) {
        return stripe.customers.createSource(custId, {
          source: stripeToken
        }).then(function() {
          return cust;
        });
      }
      return cust;
    }).then(function(cust) {
      // subscribe customer to plan
      return Promise.all([cust, subscribeToPlan(plan)]);
    }).then(function(results){
      var cust = results[0];
      var subscription = results[1];

      // WORKAROUND: The reason for the existence of this error collector is that
      // YBTV side will only catch the first error(charge),
      // and we want to wait for the result of cancelling subscription, and then do stuff.
      // So we used an error collector to collect the errors along the way,
      // and then do stuff based on how many errors being collected,
      // then throw the ideal error.
      var errorCollector = [];

      debug("Subscribe Successful!");
      var chargeAmount = plan.amount_tvod;
      if(subscription.discount && subscription.discount.coupon) {
        let cpn=subscription.discount.coupon;
        if(cpn.amount_off) { chargeAmount = chargeAmount - cpn.amount_off;}
        else if(cpn.percent_off) {
          let ca = chargeAmount * (100-cpn.percent_off)*0.01;
          chargeAmount = Math.round(ca-0.01);
        }
      }
      var chargeOpts = {
        customer: cust.id,
        amount: chargeAmount,
        currency: plan.currency,
        description: plan.description
      };

      var cancelOpts = {
        custId: subscription.customer,
        subId: subscription.id,
        at_period_end: true
      }

      var makeCharge = function (opts) {
        debug("making charge $$$$$");
        return stripe.charges.create(opts).catch(chargeErrorHandler);
      }

      var chargeErrorHandler = function (err) {
          debug("Charge error: " + err.message);
          errorCollector.push(err);
          cancelOpts.at_period_end = false;
          return utils.retry(MAX_RETRIES, cancelSubscription, cancelOpts, cancelSubscriptionErrorHandler);
      }

      var cancelSubscriptionErrorHandler = function (err){
        debug("Cancel subscription Error: " + err.message);
        var errToThrow = new Error("Cancel subscription failed, original error message: " + err.message);
        errToThrow.name = "cancelSubError";

        // If at_period_end is false, then charge must failed, so need to collect error
        // If at_period_end is true, then charge must succeeded, so just throw error.
        if(!cancelOpts.at_period_end){
          errorCollector.push(errToThrow);
        } else {
          throw errToThrow;
        }
      }

      return Promise.all([
        makeCharge(chargeOpts),
        subscription,
        cancelOpts,
        cancelSubscriptionErrorHandler,
        errorCollector
      ]);
    }).then(function(results){
      var charge = results[0];
      var subscription = results[1];
      var cancelOpts = results[2];
      var cancelSubscriptionErrorHandler = results[3];
      var errorCollector = results[4];

      debug("error Length:  " + errorCollector.length);

      // If no error in the collector, then success,
      // If there is one error, then means charge failed, cancel subscription succeeded.
      // If there are two errors, then means charge and cancel subscription both failed,
      // in this case we throw cancel fail error to handle the failure.


      if(errorCollector.length == 0){
        debug("Charge Successful!");
        // Cancel subscription if it is a rent. Users will have access to the rented package
        // until the end of the subscription period.
        if (plan.isRental()){
          debug('Rental: Cancel subscription');
          cancelOpts.at_period_end = true;
          return utils.retry(MAX_RETRIES, cancelSubscription, cancelOpts, cancelSubscriptionErrorHandler);
        }
        return subscription; // returns subscription model.
      } else if(errorCollector.length == 1) {
        throw errorCollector[0];
      } else if(errorCollector.length == 2){
        throw errorCollector[1];
      }
    });
  };

  var subscribeToPlan = function(plan) {
    debug('Subscribing user to plan', plan);
    var subopts = _.merge({ customer: custId, plan: planId }, opts || {});

    if(plan.isSVOD()) {
      subopts.source = stripeToken;
    }

    return stripe.subscriptions.create(subopts)
    .then(modifyPlanSubCount(planId, 1))
    .then(function(resp) {
      return new models.Subscription(resp);
    }).catch(function(err){
      debug("Subscribing error: " + err.message);
      throw err;
    });
  };

  var cancelSubscription = function(opts){
    debug("Cancelling subscription ------");
    return stripe.customers.cancelSubscription(opts.custId, opts.subId, {
      at_period_end: opts.at_period_end
    }).then(function(sub){
      debug("Cancel Subscription Successful!");
      return sub;
    });
  };

  return hasSubscriptionToPlan(planId, custId).then(function(hasSub) {
    debug('Checking for an existing subscription to', planId);

    if(hasSub) {
      throw new errors.AlreadySubscribedError();
    }

    return hasSub;
  }).then(function() {
    debug('Retrieving plan', planId);
    return getPlanById(planId);
  }).then(function(plan) {
    if(!plan.active) {
      throw new errors.PlanInactiveError();
    }

    return plan;
  }).then(function(plan) {
    return plan.isSVOD() ? subscribeToPlan(plan) : purchasePlan(plan);
  });
};

/**
 * Unsubscribe a customer from a plan.
 * @param {String} custId - the customer id
 * @param {String} planId - the plan to unsubscribe from
 * @returns {Promise}
 */
var unsubscribe = function(custId, planId) {
  return getSubscription(custId, planId).then(function(sub) {
    if(!sub) throw new errors.NotSubscribedError();

    return stripe.customers.cancelSubscription(custId, sub.id, {
      at_period_end: true
    });
  }).then(modifyPlanSubCount(planId, -1));
};

module.exports = {
  getPlansByTagOrVideoId: getPlansByTagOrVideoId,
  getAllPlans: getAllPlans,
  getAllPlansWithSubscriptions: getAllPlansWithSubscriptions,
  getPlanById: getPlanById,
  getSubscribedPlansForCustomer: getSubscribedPlansForCustomer,
  getSubscription: getSubscription,
  getCustomerById: getCustomerById,
  createCustomer: createCustomer,
  hasSubscriptionToVideo: hasSubscriptionToVideo,
  hasSubscriptionToPlan: hasSubscriptionToPlan,
  subscribe: subscribe,
  unsubscribe: unsubscribe
};

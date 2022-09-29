'use strict';

var _ = require('lodash');
var logger = require('node-logger')(module);
var stripe = require('node-stripe');
var api = stripe.api;
var errors = stripe.errors;
var config = require('../config');
var ums = require('node-ums');
var cmsApi = require('../lib/cmsApi');

/**
 * After getting the information of the user plans from getPackages, this function delivers the subscribe/unsubscribe/purchase
 * urls and texts depending on the method of the plan (SVOD, Rental, 1-time payment).
 * @param {Object} req - The GET request parameters.
 * @param {Object} plans - List of plan objects.
 * @return {Object} the plan with the proper context attached.
 */

var getContextForPackageList = function(req, plans) {
  return {
    plans: plans.map(function(plan) {
      var hasSubscription = !!plan.subscription;
      plan.role = req.user.role;

      if (!hasSubscription || (hasSubscription && plan.isSVOD() && !plan.subscription.isCanceled)) {
        plan.button = {};

        if (plan.isSVOD() && hasSubscription) {
          plan.button.url = '/unsubscribe/' + plan.id;
          plan.button.text = req.__('Unsubscribe');
        } else if (plan.isSVOD()) {
          plan.button.url = '/subscribe/' + plan.id;
          plan.button.text = req.__('Subscribe');
        } else if (plan.isRental()) {
          plan.button.url = '/subscribe/' + plan.id;
          plan.button.text = req.__('Rent');
        } else if (plan.isTVOD()) {
          plan.button.url = '/subscribe/' + plan.id;
          plan.button.text = req.__('Purchase');
        }
      }

      return plan;
    })
  };
};

/**
 * Throw the stripe errors or subscription errors and its categories.
 * @param {Object} req - The GET request parameters.
 * @param {Object} err - The error log object.
 * @return error message.
 */

var getErrMessage = function(req, err) {
  logger.error('Stripe error:', err);

  // Card errors are safe to expose to the user, but for
  // all other error types display something generic.
  // https://stripe.com/docs/api/node#errors

  // Note: If cancel subscription fails, the user can get access to the content without payment.
  if (err.name === 'cancelSubError') {
    var opts = {
      subject: 'Cancel Subscription Failed'
    };
    var params = {
      user: req.user.first_name + req.user.last_name,
      error: err.message
    };

    return ums.api.sendCustomEmailWithReq(config.adminEmail, 'cancel-subscription-fail', req, config, opts, params).then(function() {
      logger.error('Success');
    }).catch(function(error) {
      logger.error('email error: ' + error);
    });
  }

  if (err.type === 'StripeCardError') {
    return err.message;
  }
  if (err instanceof errors.AlreadySubscribedError) {
    return req.__('You\'re already subscribed to this package');
  }
  if (err instanceof errors.PlanDoesNotExistError) {
    return req.__('This package does not exist');
  }
  if (err instanceof errors.NotSubscribedError) {
    return req.__('You are not subscribed to this package');
  }
  if (err instanceof errors.PlanInactiveError) {
    return req.__('This package does not exist');
  }

  return req.__('An error occurred. Please try again');
};

/**
 * Get all the packages and contexts.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */

module.exports.getPackages = function(req, res, next) {
  if (!req.isAuthenticated()) return res.redirect(config.sso.loginURL);

  var render = function(plans) {
    res.render('packages/main', _.merge({
      pageTitle: req.__('Packages')
    }, getContextForPackageList(req, plans)));
  };

  if (req.user.role === 'admin') {
    return api.getAllPlans({
      active: true
    }).then(render).catch(next);
  }

  api.getAllPlansWithSubscriptions(req.user.get('metadata').stripeUserId, {
      active: true
    })
    .then(render)
    .catch(next);
};
module.exports.videoInPackages = function(req,res) {
  if (!req.isAuthenticated()) {
    return res.send('must logged in');
  }
  api.getAllPlansWithSubscriptions(req.user.get('metadata').stripeUserId, {active: true})
  .then((plans)=>{
    logger.info('videoInPackages:plans:',plans);
  })
  .catch((err)=>{
    logger.error('videoInPackages:api.getAllPlansWithSubscriptions:err',err);
    res.send('get sub error');
  });

};

/**
 * Get all the packages from a user and the contexts.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @param {Object} next - The callback for the next route.
 * @return callback to the next step in the route
 */

module.exports.getMyPackages = function(req, res, next) {
  var context = {
    pageTitle: req.__('My Packages'),
    title: req.__('My Packages'),
  };

  if (req.user.role === 'admin') {
    return res.render('my-packages/main', context);
  }
  logger.info('Getting subscribed plans for stripe customer: ' + req.user.get('metadata').stripeUserId);

  function hiddenPlanList(plans) {
    var hiddenPlans = [];
    for (var i=0; i < plans.length; i++) {
      var plan = plans[i];
      if (!plan.hide_plans) {
        continue;
      }

      var plansToHide = plan.hide_plans.split(',');
      for (var j=0; j < plansToHide.length; j++) {
        hiddenPlans.push(plansToHide[j]);
      }
    }
    return _.uniq(hiddenPlans);
  }

  function removeHiddenPlans(allPlans) {
    var plansToHide = hiddenPlanList(allPlans);
    var plans = [];

    for (var i=0; i<allPlans.length; i++) {
      if (plansToHide.indexOf(allPlans[i].id) === -1) {
        plans.push(allPlans[i]);
      }
    }
    return plans;
  }

  api.getSubscribedPlansForCustomer(req.user.get('metadata').stripeUserId).then(function(allPlans) {
    var plans = removeHiddenPlans(allPlans);
    var videoPromises = [];
    for(var i=0; i < plans.length; i++){
      var currentPlan = plans[i];
      if(currentPlan.hasVideos()){
        var planVideoId = currentPlan.videos[0];
        videoPromises.push(
          currentPlan.video = cmsApi.findVideoByIdWithoutRating(planVideoId, {}).catch((err)=>{return err;})
        );
      }
    }

    Promise.all(videoPromises).then(function(videoResponses) {
      logger.info('getMyPackages:return from cmsApi.findVideoByIdWithoutRating:plans='+plans.length);
      var plansWithoutVideoCounter = 0;

      for(var i=0; i < plans.length; i++) {
        var currentPlan = plans[i];

        if (!currentPlan.hasVideos()) {
            plansWithoutVideoCounter++;
            continue;
        }

        var planVideoId = plans[i].videos[0];
        logger.info('--- All video ids: ' + plans[i].videos.join(','));
        logger.info('--- VIDEO '+planVideoId+' FOR PLAN '+i+':'+plans[i].id+': rsp=',videoResponses[i]);

        if(videoResponses[i - plansWithoutVideoCounter] && videoResponses[i - plansWithoutVideoCounter].data) {
          plans[i].video = videoResponses[i - plansWithoutVideoCounter].data;
          plans[i].video.slug = plans[i].video.name.trim()
                                             .toLowerCase()
                                             .replace(/ /g, '-')
                                             .replace(/[^a-z0-9\-]+/ig, '')
                                             .replace(/\./g, '_');
        } else {
          logger.error('getMyPackages:get video '+planVideoId+' error:',JSON.stringify(videoResponses[i]));
          plans[i].video = undefined;
        }
      }
      logger.info('getMyPackages:render my-packages');
      res.render('my-packages/main', _.merge(context, getContextForPackageList(req, plans)));
    }).catch((err)=>{
      logger.error('getMyPackages:cmsApi.findVideoByIdWithoutRating:err',err);
    });
  }).catch((err)=>{
    logger.error('getMyPackages:api.getSubscribedPlansForCustomer:err',err);
    next();
  });
};


/**
 * Loads the subscription page for the requested user, using Stripe API.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @return the status of the subscription process
 */

module.exports.getSubscribe = function(req, res) {
  if (req.user.role === 'admin') {
    req.flash('error', req.__('As an administrator, you have access to all plans in the system'));
    res.redirect('/packages');
    return;
  }

  api.hasSubscriptionToPlan(req.params.id, req.user.get('metadata').stripeUserId).then(function(isSubscribed) {
    if (isSubscribed) {
      throw new errors.AlreadySubscribedError();
    }

    return isSubscribed;
  }).then(function() {
    return Promise.all([
      api.getPlanById(req.params.id, {
        active: true
      }),
      api.getCustomerById(req.user.get('metadata').stripeUserId)
    ]);
  }).then(function(results) {
    var plan = results[0];
    var cust = results[1];
    var cancelUrl = req.headers.referer || '/packages';

    // This might be hacky.
    // trimmed the root url of cancelUrl.
    var successUrl = '';
    if (cancelUrl.indexOf('/' + config.videoPrefix + '/') > -1) {
      successUrl = cancelUrl.substr(cancelUrl.indexOf('/' + config.videoPrefix + '/'), cancelUrl.length - 1);
    }

    res.render('subscribe/main', _.extend({
      pageTitle: req.__('Subscribe to %s', plan.name),
      plan: plan,
      isMember: req.user.isMember,
      successUrl: successUrl,
      formActionUrl: req.originalUrl,
      cancelUrl: cancelUrl,
      hasCardOnFile: cust.hasCardOnFile,
      defaultCard: cust.defaultCard,
    }, req.body));
  }).catch(function(err) {
    req.flash('error', getErrMessage(req, err));
    res.redirect('/packages');
  });
};

/**
 * Register a subscription for a requested user, using the stripe API.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 */

module.exports.postSubscribe = function(req, res) {
  let psubopt = {};
  if(req.user.isMember) {
    psubopt = {coupon:'Member'};
  }

  api.subscribe(
    req.user.get('metadata').stripeUserId,
    req.params.id,
    req.body.stripeToken,
    psubopt
  ).then(function(sub) {
    if (req.body.successUrl) {
      res.redirect(req.body.successUrl);
    } else {
      req.flash('success', req.__('Thank you for purchasing access to %s!', sub.plan.name));
      res.redirect('/my-packages');
    }
  }).catch(function(err) {
    req.flash('error', getErrMessage(req, err));
    res.redirect(req.originalUrl);
  });
};

/**
 * Loads the unsubscription page for the requested user, using Stripe API.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @return the status of the subscription process
 */

module.exports.getUnsubscribe = function(req, res) {
  api.getSubscription(req.user.get('metadata').stripeUserId, req.params.id).then(function(sub) {
    var context = {
      pageTitle: req.__('Unsubscribe'),
      subscription: sub,
      formActionUrl: req.originalUrl,
      goBackUrl: req.headers.referer || '/packages'
    };

    res.render('unsubscribe/main', context);
  }).catch(function(err) {
    req.flash('error', getErrMessage(req, err));
    res.redirect('/packages');
  });
};

/**
 * Unregister a subscription for a requested user, using the stripe API.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 */

module.exports.postUnsubscribe = function(req, res) {
  api.unsubscribe(req.user.get('metadata').stripeUserId, req.params.id).then(function() {
    req.flash('success', req.__('Unsubscribed!'));
    res.redirect('/my-packages');
  }).catch(function(err) {
    req.flash('error', getErrMessage(req, err));
    res.redirect(req.originalUrl);
  });
};

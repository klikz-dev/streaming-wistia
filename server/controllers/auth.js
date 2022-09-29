'use strict';
/*
All the authorization/login methods
*/



var passport = require('passport');
var _ = require('lodash');
var ums = require('node-ums');
var stripe = require('node-stripe');

/**
 * Redirect the session.
 * @param {Object} req - The GET request parameters.
 * @return {String} the redirect path or the '/' path if invalid.
 */

var getRedirect = function(req) {
  var val = req.session.redirect;
  if (val)
    delete req.session.redirect;
  return val || '/';
};

/**
 * Validate email and password.
 * @param {Object} req - The GET request parameters.
 * @return {Object} the validation erros if any.
 */

function validate(req) {
  if ('email' in req.body) {
    req.assert('email', 'Email is not valid').isEmail();
  }
  req.assert('password', 'Password must be at least 6 characters').gte(6);
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.assert('password', 'Password must have at least 1 uppercase character').atLeastOneUppercase();
  req.assert('password', 'Password must have at least 1 number').atLeastOneNumber();
  req.assert('password', 'Password should only contain anything in the range of letters, numbers and +-_').validChar();
  req.assert('confirm', 'Password confirmation cannot be blank').notEmpty();
  req.assert('password', 'Passwords do not match').equals(req.body.confirm);
  return req.validationErrors();
}


/**
 * Login the user if authenticated.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @return {String} redirect path.
 */

module.exports.getLogin = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render('login/main');
};

/**
 * Receives and authenticates the post request with login information.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 * @return the attached authorization response answer with 'passport' module support.
 */

module.exports.postLogin = function(req, res, next) {
  var options = {
    failureRedirect: '/user/login',
    successRedirect: getRedirect(req),
    failureFlash: true
  };
  return passport.authenticate('local', options, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  })(req, res, next);
};

/**
 * Logout the user and redirect to login page.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 */

module.exports.getLogout = function(req, res) {
  req.logout();
  res.redirect('/user/login');
};

/**
 * Register the user if authenticated.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 * @return the redirect '/' path if registration succeeds.
 */

module.exports.getRegister = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.render('register/main');
};

/**
 * Register and validate the POST registration request.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 * @return redirect path or the 'register/main' path if fails.
 */

module.exports.postRegister = function(req, res, next) {
  var errors = validate(req);

  if (errors) {
    req.flash('error', errors);
    return res.render('register/main', req.body);
  }

  ums.api.register({
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  }).then(function(user) {
    req.login(user, function(err) {
      if (err) return next(err);
      res.redirect(getRedirect(req));
    });
  }).catch(function(err) {
    req.flash('error', err.message);
    return res.render('register/main', req.body);
  });
};

/**
 * Register via Facebook and redirect for the req referred path.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 */

module.exports.getRegisterFacebookCallback = function(req, res) {
  res.redirect(getRedirect(req));
};

/**
 * Renders the recover page.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 */

module.exports.getRecover = function(req, res) {
  res.render('recover/main');
};

/**
 * Authenticates and validates recover info.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 * @return the attached renderization page
 */

module.exports.postRecover = function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.render('recover/main', req.body);
  }

  ums.api.sendPasswordResetEmail(req.body.email).then(function() {
    req.flash('success', req.__('Please check your email for instructions'));
    res.render('recover/main');
  }).catch(function(err) {
    req.flash('error', err.message);
    res.render('recover/main');
  });
};

/**
 * Resets password.
 * @param {Object} req - The GET request parameters.
 * @param {Object} res - The GET request response parameters.
 */

module.exports.getResetPassword = function(req, res) {
  ums.api.getUserByResetSlug(req.params.slug).then(function(user) {
    res.render('reset-password/main', {
      email: user.email,
      slug: req.params.slug
    });
  }).catch(function(err) {
    req.flash('error', err.message);
    res.render('recover/main');
  });
};

/**
 * Receives and process 'the reset password' info.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 * @return the attached renderization page
 */

module.exports.postResetPassword = function(req, res, next) {
  var errors = validate(req);

  if (errors) {
    req.flash('error', errors);
    return res.render('reset-password/main', req.body);
  }

  ums.api.getUserByResetSlug(req.body.slug).then(function(user) {
    return ums.api.resetPassword(req.body.slug, user.id, req.body.password);
  }).then(function(user) {
    req.login(user, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  }).catch(next);
};

/**
 * Account handling.
 * @param {Object} req - The POST request parameters.
 * @param {Object} res - The POST request response parameters.
 */

module.exports.myAccount = function(req, res, next) {
  var isPost = req.method === 'POST';
  var isSavingPayment = 'stripeToken' in req.body;
  var context = _.merge({}, req.user.toJSON(), req.body);

  if (req.user.role === 'admin') {
    res.render('my-account/main', context);
    return;
  }

  Promise.all([
    stripe.api.getCustomerById(req.user.metadata.stripeUserId)
  ]).then(function(responses) {
    var cust = context.cust = responses[0];

    // If saving profile
    if (isPost && !isSavingPayment) {
      context.isEditingProfile = true;
      var errors = validate(req);

      if (errors) {
        req.flash('error', errors);
        res.render('my-account/main', context);
      } else {
        Promise.all([
          ums.api.changePassword(null, req.body.password, false),
          ums.api.changeEmail(req.body.email)
        ]).then(function() {
          req.flash('success', 'Profile updated!');
          res.redirect(req.url);
        }).catch(function(err) {
          req.flash('error', err.message);
          res.render('my-account/main', context);
        });
      }

      return;
    }

    // If saving payment
    if (isPost && isSavingPayment) {
      context.isEditingPayment = true;

      stripe.lib.customers.update(cust.id, {
        source: req.body.stripeToken
      }).then(function() {
        req.flash('success', 'Card updated!');
        res.redirect(req.url);
      }).catch(function(err) {
        req.flash('error', err.message);
        res.render('my-account/main', context);
      });

      return;
    }

    // If GET
    res.render('my-account/main', context);
  }).catch(next);
};

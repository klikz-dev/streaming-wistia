'use strict';

// Fn to create and configure a shared instance of the Stripe module
var init = module.exports.init = require('./lib');

// Create the instance and expose it. At this point it won't be configured
// until init is called with an API key.
module.exports.lib = init().stripe;
module.exports.api = require('./lib/api');
module.exports.errors = require('./lib/errors');
module.exports.models = require('./lib/models');
module.exports.utils = require('./lib/utils');

'use strict';

// This file wraps the Stripe library and turns it into a singleton.
// The reason is because Stripe requires you to set the API key
// each time it's require()'d, which would require us to pass the API
// token around to each module that consumes it. This file will create
// an instance once, configure the API key when it becomes available,
// and allow us to consume the configured instance in multiple places.

var _ = require('lodash');
var lib;

module.exports = function(secretKey, opts) {
  // On the first call of this fn, generate a shared "singleton" that can be
  // passed around to other modules
  if(!lib) {
    lib = {
      stripe: require('stripe')(),
      opts: {
        debug: true,
        max_retries: 3,
        currencySymbolMap: {
            'usd': '$',
            'aud': '$',
            'cad': '$',
            'gbp': '£',
            'eur': '€',
            'jpy': '¥',
            'chf': 'CHF.',
            'cny': '¥',
            'sgd': '$',
            'hkd': '$'
        },
        templates: {
          currency: {
            repeating: '' +
              '<%= currencySymbol %>' + '<%= discountAmount %> <%= currency %> / ' +
              '<%= interval_count %> <%= interval %> ' +
              'until <%= expiration %>, ' +
              '<%= currencySymbol %>' + '<%= amount %> / <%= interval_count %> <%= interval %> after',
            once: '' +
              '<%= currencySymbol %>' + '<%= discountAmount %> <%= currency %> ' +
              'the first month, ' +
              '<%= currencySymbol %>' + '<%= amount %> <%= currency %> / <%= interval_count %> <%= interval %> after',
            forever: '' +
              '<%= currencySymbol %>' + '<%= amount %> <%= currency %> / ' +
              '<%= interval_count %> <%= interval %>',
            tvod: '' +
              '<%= currencySymbol %>' + '<%= amount %> <%= currency %> one-time'
          }
        }
      }
    };
  }

  if(secretKey) {
    lib.stripe.setApiKey(secretKey);
  }

  if(opts) {
    _.merge(lib.opts, opts);
  }

  return lib;
};

/* jshint camelcase: false */
'use strict';

var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var configs = {};

/**
 * Development
 */
configs.development = {
  locale: 'en',

  siteName: 'ASCD Streaming Video',

  featuredMediaIds: [83590968, 83590966, 83590900, 83590664],

  categories: [],

  marketingOverlay: [],

  categories: [
    // {
    //   title: 'Webinars',
    //   slug: 5798567,
    // },
    // {
    //   title: 'ASCD-User Created Videos',
    //   slug: 6277127,
    // },
    // {
    //   title: 'ASCD-APLS',
    //   slug: 6278241,
    // },
    // {
    //   title: 'ASCD',
    //   slug: 6279732,
    // },
    // {
    //   title: 'ASCD-Online Products',
    //   slug: 6282020,
    // },
    // {
    //   title: 'LDPLS',
    //   slug: 6339385,
    // },
    {
      title: 'Webstreams',
      slug: 6568576,
    },
    // {
    //   title: 'Engagement Marketing Videos',
    //   slug: 7301439,
    // },
    // {
    //   title: 'Educational Leadership',
    //   slug: 7439104,
    // },
    // {
    //   title: 'Professional Learning Educator Success',
    //   slug: 7693501,
    // },
  ],

  projects: [
    // {
    //   title: 'Webinars',
    //   projectId: 5798567,
    // },
    {
      title: 'Webstreams',
      projectId: 6568576,
    },
    // {
    //   title: 'LDPLS',
    //   projectId: 6339385,
    // },
    // {
    //   title: 'Engagement Marketing Videos',
    //   projectId: 7301439,
    // },
    // {
    //   title: 'Educational Leadership',
    //   projectId: 7439104,
    // },
    // {
    //   title: 'Professional Learning Educator Success',
    //   projectId: 7693501,
    // },
  ],
  previewTime: 60,
}

configs.testing = _.merge({}, configs.development, {});

/**
 * Staging
 */
configs.staging = _.merge({}, configs.development, {});

/**
 * Production
 */
configs.production = _.merge({}, configs.development, {});

module.exports = configs[env];

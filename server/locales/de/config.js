/* jshint camelcase: false */
'use strict';

var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var configs = {};


/**
 * Development
 */
configs.development = {
  locale: 'de',

  cms: {
    accountId: '2779557264001',
    clientId: 'bcb0b216-8f51-447c-9e60-3f230e6e4a15',
    clientSecret: 'mFXQaj_S-8NX4B-A-noXpIfUSB9kfyKZ-oCVjbjysv5MvJFz7cVeWd5Dq9oY6vHa9dARwZZ8yZX3Yo4h-zmg6w'
  },

  // Video cloud account number
  publisherID: 2779557264001,

  // Player ID
  playerID: '4477032a-b674-420f-a1ca-a74f94410491',
  playerUrl: '//players.brightcove.net/2779557264001/4477032a-b674-420f-a1ca-a74f94410491_default/index.min.js',

  // Name of this site. Used as default page titles, site name in Open Graph
  // tags, home link in the navigation, etc.
  siteName: 'UwMerk TV',

  featuredVideosPlaylistId: 4095929364001,

  categories: [{
      name: 'Toevallig',
      slug: 'toevallig',
      categories: [{
                    name: 'Documentaires',
                    slug: 'documentaires',
                    categories: [{
                                  name: 'Natuur Documentaires',
                                  slug: 'nature',
                                  query: { q: 'tags:nature' }
                                }]
                  },
                  {
                    name: 'Mode',
                    slug: 'mode',
                    query: { q: 'tags: fashion,fashon' }
                  }]
    },
    {
      name: 'Automobiels',
      slug: 'automobiel',
      query: { q: 'tags:automobiles' }
    }
  ],
};

/**
 * Staging
 */
configs.staging = _.merge({}, configs.development, {
});

/**
 * Production
 */
configs.production = _.merge({}, configs.development, {
});

module.exports = configs[env];

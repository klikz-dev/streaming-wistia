/* jshint camelcase: false */
'use strict';

var env = process.env.NODE_ENV || 'development';
var redisUrl = process.env.REDIS_CLUSTER || '';
var dbUrl = process.env.DB_URL || '';
var dbUser = process.env.DB_USER || '';
var dbPswd = process.env.DB_PSWD || '';
var dbName = process.env.DB_NAME || 'ybtv';
var useNewAuthServer = (process.env.USE_NEW_AUTH || 'false') === 'true';

var _ = require('lodash');
var path = require('path');
var events = require('events');
// const redisStore = require('cache-manager-redis');
var eventEmitter = new events.EventEmitter();
var configs = {};
const ONE_MINUTE_SEC = 60;

/**
 * Development Configurations
 */
configs.development = {
  port: 9010,
  livereload_port: 35729,

  // Number of videos that should appear in the detail page's grid
  numDetailGridVideos: 12,

  // Number of videos per page on the search results page
  numSearchVideos: 10,

  // Number of videos to appear in the autocomplete list
  numAutocompleteVideos: 5,

  // Number of videos to appear in the home page's carousel
  numHomePopularVideos: 12,

  // Number of videos to appear in the home page's grid
  numHomeGridVideos: 12,

  // The prefix that will go at the beginning of video detail pages
  videoPrefix: 'watch',

  logger: {
    level: 'error', // http, debug, info, warn, or error
  },

  // Path to the main handlebars templates. This is passed directly to
  // Express's app.set('views') setting
  viewsDir: path.join(__dirname, '../../src/templates'),

  handlebars: {
    defaultLayout: 'layout',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../../src/templates'),
    partialsDir: [path.join(__dirname, '../../src')],
  },
  stripe: {
    secretKey: 'sk_test_cc4sh9axkwks2g5cJNG2HJuS',
    publishableKey: 'pk_test_FlrDlWUwOJQDuWm7gdtP4Za4',
    opts: {
      debug: true,
    },
  },

  // Localization settings
  localization: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '../locales/'),
  },

  // In memory cache
  cache: {
    enabled: true,
    opts: {
      store: 'memory',
      max: 100,
      ttl: ONE_MINUTE_SEC,
    },
  },
  session: {
    store: {
      // session-file-store module options
      ttl: 3600,
    },
    opts: {
      secret: 'ybtv',
      resave: false,
      saveUninitialized: false,
    },
  },

  // Analytics API
  analytics: {
    ttl: ONE_MINUTE_SEC * 60,
    key: 'analytics',
  },

  // The max number of sessions a given user can have logged in at a time
  maxSessions: 3,

  // If social accounts with emails that already exist using normal registration are allowed
  sameSocialEmails: false,

  // If users have to click on a verification link sent to their email to use their accounts
  emailVerify: false,

  // Email service configuration
  email: {
    // Configure SMTP here.
    // For more info, visit https://nodemailer.com/
    transport: {
      type: 'smtp',
      host: 'localhost',
      port: 25,
      auth: {
        user: 'username',
        pass: 'password',
      },
    },
    rateLimit: 10, // max number of emails that can be sent per second
    templateDir: path.join(__dirname, '../../src/templates/emails/'), // email template directory
    resetPassword: {
      // reset password email config
      url: 'http://localhost:{port}/user/reset/{slug}',
      expiration: 24, // in hours
    },
    verify: {
      // verification email config
      url: 'http://localhost:{port}/user/verify',
    },
    defaults: {
      from: {
        // from email config
        name: '', // email name
        address: '', // email address
      },
    },
  },

  // Is internal UMS enabled
  internalUMSEnabled: false,

  // Show rating requires internal UMS at the moment
  showRating: false,

  // Upload video feature
  upload: false,

  /*
   * SSO parameters if not using internal UMS
   */
  sso: {
    // URL for the authentication portal
    loginURL: 'http://testauth77.ascd.org/stream.aspx?vid=20',
    // Base URL for the API
    baseURL: 'http://testauth77.ascd.org:8090/api',
    // URL for logout the user in authentication portal
    logoutURL:
      'http://testauth77.ascd.org/Logout.aspx?vid=18&redirect=' +
      'http://localhost:9010',
    // The relative url paths added to baseURL
    paths: {
      admins: 'admins',
      users: 'Subscribers',
      stripe: 'stripeId',
    },
  },

  // Event Emitter
  on: eventEmitter.on,
  off: eventEmitter.off,
  emit: eventEmitter.emit,

  // the Schedule Filter is on by default.
  // This filters out unscheduled videos on the backend.
  // Note: Date should be set properly on the server.
  scheduleFilterEnabled: true,

  // Administrator's email, sent error detail to this email when cancel payment fails
  adminEmail: '',
  db: {
    host: dbUrl,
    user: dbUser,
    pswd: dbPswd,
    db: dbName,
  },
};

/**
 * Setter/getter functions
 */

configs.development.getLocaleSettings = function (locale) {
  locale = locale || this.localization.defaultLocale;
  return _.merge(
    {},
    this,
    require(path.join(this.localization.directory, locale + '/config'))
  );
};

/**
 * aws elastic beanstalk
 */

configs.eb = _.merge({}, configs.development, {
  port: 8081,
  viewsDir: path.join(__dirname, '../../dist/templates'),
  handlebars: {
    layoutsDir: path.join(__dirname, '../../dist/templates'),
    partialsDir: [path.join(__dirname, '../../dist')],
  },
  logger: {
    level: 'warn',
  },
  passport: {},
  cache: {
    enabled: redisUrl !== '',
    opts: {
      store: {},
      host: redisUrl,
      ttl: ONE_MINUTE_SEC * 60 * 8,
    },
  },
  session: {
    store: {
      // connect-redis module optons
      host: redisUrl,
      port: 6379,
      ttl: 3600,
    },
    opts: {
      secret: 'ybtv',
      resave: false,
      saveUninitialized: false,
    },
  },
});
/**
 * testing uses a different stripe account
 */

configs.testing = _.merge({}, configs.eb, {
  stripe: {
    // stripe config for test---TODO
    secretKey: 'sk_test_cc4sh9axkwks2g5cJNG2HJuS',
    publishableKey: 'pk_test_FlrDlWUwOJQDuWm7gdtP4Za4',
    opts: {
      debug: false,
    },
  },
});

/**
 * Stagging uses a different stripe account
 */

configs.staging = _.merge({}, configs.eb, {
  sso: {
    // URL for the authentication portal
    loginURL: 'http://testauth.ascd.org/stream.aspx?vid=20',
    // Base URL for the API
    baseURL: 'http://testauth.ascd.org:8090/api',
    // URL for logout the user in authentication portal
    logoutURL:
      'http://testauth.ascd.org/Logout.aspx?vid=20&redirect=' +
      'http://ybtv-staging.us-east-1.elasticbeanstalk.com',
  },
  stripe: {
    // stripe config for staging---TODO
    secretKey: 'sk_test_cc4sh9axkwks2g5cJNG2HJuS',
    publishableKey: 'pk_test_FlrDlWUwOJQDuWm7gdtP4Za4',
    opts: {
      debug: false,
    },
  },
});

/**
 * Production uses a different stripe account
 */

configs.production = _.merge({}, configs.eb, {
  sso: {
    // url for the authentication portal
    loginURL: useNewAuthServer
      ? 'http://ascdauth1.ascd.org:8095/stream.aspx?vid=15'
      : 'http://auth.ascd.org/stream.aspx?vid=15',
    // base url for the api
    baseURL: useNewAuthServer
      ? 'http://ascdauth1.ascd.org:8095/api'
      : 'http://auth.ascd.org:8090/api',
    // URL for logout the user in authentication portal
    logoutURL: useNewAuthServer
      ? 'http://ascdauth1.ascd.org:8095/Logout.aspx?vid=15&redirect=http://ybtv.us-east-1.elasticbeanstalk.com'
      : 'http://auth.ascd.org/Logout.aspx?vid=15&redirect=http://streaming.ascd.org',
  },
  stripe: {
    // stripe config for production---TODO
    secretKey: 'sk_live_cegeoscZs5jIfMbNTv58a6iw',
    publishableKey: 'pk_live_8j6YdLFUuQ0MHq7rflAqV26b',
    opts: {
      debug: false,
    },
  },
});

module.exports = configs[env];

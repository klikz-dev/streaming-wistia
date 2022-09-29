/* jshint camelcase: false */
'use strict';

var env = process.env.NODE_ENV || 'development';
var express = require('express');
var expressValidator = require('express-validator');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var compression = require('compression');
var expressWinston = require('express-winston');
var path = require('path');
var _ = require('lodash');
var FileSessionStore = require('session-file-store')(session);
// var RedisSessionStore = require('connect-redis')(session);

var config = require('./config');
var ums = config.internalUMSEnabled ? require('./config/ums') : null;
var app = express();
var ratings = config.showRating ? require('./lib/ratings') : null;

// Configure mustbe authorization
var mustbe = require('mustbe');
mustbe.configure(require('./config/mustbe'));

// Configure i18n
var i18n = require('i18n');
i18n.configure(config.localization);
app.use(i18n.init);

var routes = require('./config/routes');
var hbs = require('./lib/hbs')(app);
var middleware = require('./middleware');
var controllers = require('./controllers');

// Configure Stripe
var stripe = require('node-stripe');
stripe.init(config.stripe.secretKey, config.stripe.opts);

// Configure logger
var logger = require('node-logger');
logger.init({
  level: config.logger.level
});
logger = logger(module);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', config.viewsDir);
app.set('port', config.port);
app.use(compression());
app.use(expressValidator({
  customValidators: {
    gte: function(param, num) {
      return param.length >= num;
    },
    equals: function(param, string) {
      return param === string;
    },
    atLeastOneUppercase: function(param) {
      var regex = /(?=.*[A-Z])/;
      return regex.test(param);
    },
    atLeastOneNumber: function(param) {
      var regex = /(?=.*[0-9])/;
      return regex.test(param);
    },
    validChar: function(param) {
      var regex = /[^a-zA-Z0-9\+\_\-]/;
      return !regex.test(param);
    }
  }
}));

// Configure static paths
// Note: these are only relevant in dev mode. In production, nginx should
// be sitting in front of the node instance to serve static assets.
if (env === 'development') {
  app.use(express.static(path.join(__dirname, '../.tmp')));
  app.use(express.static(path.join(__dirname, '../src')));
  app.use(express.static(path.join(__dirname, '../'))); // for sourcemaps
  app.use(express.static(path.join(__dirname, '../templates'))); // for common code
  app.use(require('connect-livereload')({
    port: config.livereload_port
  }));
} else {
  app.use(express.static(path.join(__dirname, '../dist')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// if host property is available in session.store. initialize redis session store (production)
/* if (config.session.store.host) {
  app.use(session(_.extend({
    store: new RedisSessionStore(config.session.store)
  }, config.session.opts)));
} else { // initialize file system session store (development) */
  app.use(session(_.extend({
    store: new FileSessionStore(config.session.store)
  }, config.session.opts)));
// }

// init Passport
var passport = require('./config/passport');
passport.init(app);

app.use(flash());

if (ums !== null) {
  app.use(ums.routeGrabber);
}

// Enable http request logging. Log level must be set to http in the config
// in order to see these logs.
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: false,
  colorStatus: true,
  msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms - {{req.url}}',
  level: 'http'
}));

// Init ratings lib and cms api
if (ratings !== null) {
  ratings.init();
}

// Attach middleware
app.use(middleware.localization.setLocale);
app.use(middleware.bootstrap);
app.use(middleware.templateContext);

// Attach routes
app.use(routes);
app.use(controllers.static.err404);
app.use(controllers.static.err500);

var startServer = function() {
  app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port') + '. Mode: ' + app.get('env'));
  });
};

if (ums !== null) {
  ums.init(config).then(startServer).catch(logger.error);
} else {
  startServer();
}

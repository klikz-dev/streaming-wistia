'use strict';

var router = require('express').Router();
var ssoRouter = require('../routers/sso');
var umsRouter = require('../routers/ums');
var controllers = require('../controllers');
var mustbe = require('mustbe').routeHelpers();
var attachTaxonomy = require('../middleware').attachTaxonomy;
// var pullAnalytics = require('../middleware').pullAnalytics;
var restrict = require('../middleware').restrict.regularPageRestrict;
var detailPageRestrict = require('../middleware').restrict.detailPageRestrict;
var videoAvailabilityCheck = require('../middleware').videoAvailabilityCheck;
var config = require('./index').getLocaleSettings();

/*
Check the user authorization to actually watch the video, using mustbe library
*/
var canWatchVideo = function () {
  return mustbe.authorized(
    'watch video',
    function authorized(req, res, next) {
      res.locals.isAuthorized = true;
      next();
    },
    function unauthorized(req, res, next) {
      res.locals.isAuthorized = false;
      next();
    }
  );
};

/*
Definition of all routes.
Each route leads to a specific controller/middleware that will deal with the GET/POST request.
*/

router.use(function (req, res, next) {
  if (config.internalUMSEnabled) {
    res.locals.user = req.user ? req.user.toJSON() : {};
  } else {
    res.locals.user = req.user ? req.user : {};
  }
  res.locals.user.isLoggedIn = req.isAuthenticated();
  next();
});

router.get('/', attachTaxonomy, controllers.home.homePage);
router.get('/search', attachTaxonomy, controllers.search.searchPage);
router.get('/autocomplete', attachTaxonomy, controllers.search.autocomplete);
router.get('/rcache', attachTaxonomy, controllers.rcache.rcachePage);

if (config.internalUMSEnabled) {
  /*
  Auth routes ums
  */
  umsRouter.init(router);
} else {
  /*
  Auth routes sso
  */
  ssoRouter.init(router);
}

if (config.upload) {
  /*
  Upload routes
  */

  //GET
  router.get(
    '/upload',
    attachTaxonomy,
    restrict,
    controllers.ugc.getUserUpload
  );
  //POST
  router.post(
    '/upload',
    attachTaxonomy,
    restrict,
    controllers.ugc.postUploadCreds
  );
  router.post(
    '/upload/complete',
    attachTaxonomy,
    restrict,
    controllers.ugc.postCompleteUpload
  );
  router.post(
    '/upload/callback',
    attachTaxonomy,
    controllers.ugc.postIngestCallback
  );
}

/*
SVOD routes
*/

//GET
router.get('/packages', restrict, attachTaxonomy, controllers.svod.getPackages);
router.get(
  '/my-packages',
  restrict,
  attachTaxonomy,
  controllers.svod.getMyPackages
);
router.get(
  '/subscribe/:id',
  restrict,
  attachTaxonomy,
  controllers.svod.getSubscribe
);
router.get(
  '/unsubscribe/:id',
  restrict,
  attachTaxonomy,
  controllers.svod.getUnsubscribe
);
//POST
router.post(
  '/subscribe/:id',
  restrict,
  attachTaxonomy,
  controllers.svod.postSubscribe
);
router.post(
  '/unsubscribe/:id',
  restrict,
  attachTaxonomy,
  controllers.svod.postUnsubscribe
);

/*
Text pages routes
*/
router.get('/terms', attachTaxonomy, controllers.static.getTerms);
router.get('/faq', attachTaxonomy, controllers.static.getFAQ);
router.get('/privacy', attachTaxonomy, controllers.static.getPrivacy);

// Config
router.get('/config', attachTaxonomy, controllers.config.getConfig);

//Detail pages and taxonomy (3-levels max)
router.get(
  [
    '/:projectId',
    '/:projectId/:videoId',
    '/' +
      config.videoPrefix +
      '/:grandparent/:parent/:child/:videoId/:videoName',
    '/' + config.videoPrefix + '/:parent/:child/:videoId/:videoName',
    '/' + config.videoPrefix + '/:child/:videoId/:videoName',
  ],
  detailPageRestrict,
  attachTaxonomy,
  // videoAvailabilityCheck,
  canWatchVideo(),
  controllers.detail.detailPage
);

//vpop page
router.get(
  '/vpop/:child/:videoId',
  detailPageRestrict,
  attachTaxonomy,
  videoAvailabilityCheck,
  canWatchVideo(),
  controllers.vpop.vpopPage
);

//Share video pages and taxonomy (3-levels max)
router.get(
  [
    '/share/' +
      config.videoPrefix +
      '/:grandparent/:parent/:child/:videoId/:videoName',
    '/share/' + config.videoPrefix + '/:parent/:child/:videoId/:videoName',
    '/share/' + config.videoPrefix + '/:child/:videoId/:videoName',
  ],
  attachTaxonomy,
  controllers.share.sharePage
);

// tracking
// router.post('/tracking/init', controllers.tracking.init);
// router.post('/tracking/addfv', controllers.tracking.addfv);
// router.post('/tracking/favorite/toggle', controllers.tracking.postFavoriteToggle);
// router.post('/tracking/record/:cusid?', controllers.tracking.postTrack);
// router.get('/tracking/track/:cusid?', controllers.tracking.track);
// router.get('/tracking/favorite/:cusid?', controllers.tracking.favorite);
// router.get('/my-favorites', restrict,   controllers.tracking.getMyFavorites);

// If we get this far, attempt to translate the entire URL into a category
// page or a category detail page
router.get(
  '*',
  detailPageRestrict,

  canWatchVideo(),
  [controllers.category.categoryPage, controllers.detail.detailPage]
);

module.exports = router;

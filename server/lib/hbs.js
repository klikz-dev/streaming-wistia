'use strict';

var exphbs = require('express-handlebars');
var _ = require('lodash');
var path = require('path');
var settings = require('../config');
var Taxonomy = require('../models/taxonomy');
var config = settings.getLocaleSettings();
var hbs;

settings.on('localechanged', function () {
  config = settings.getLocaleSettings();
});

/**
 * All the handlebars configuration is set up here. Every time a video detail page is clicked, for example,
 * hbs.js will be called to generate the correct links, templates and general html contexts
 */

module.exports = function (app) {
  hbs = exphbs.create(
    _.merge(config.handlebars, {
      helpers: {
        block: function (name) {
          var blocks = this._blocks;
          var content = blocks && blocks[name];
          return content ? content.join('\n') : null;
        },
        contentFor: function (name, options) {
          var blocks = this._blocks || (this._blocks = {});
          var block = blocks[name] || (blocks[name] = []);
          block.push(options.fn(this));
        },
        json: function (obj) {
          return JSON.stringify(obj);
        },
        isArray: function (context, options) {
          return Array.isArray(context)
            ? options.fn(this)
            : options.inverse(this);
        },
        divide: function (value, divisor) {
          return value / divisor;
        },
        formatDuration: function (value) {
          return (
            parseInt(value / 60).toString() +
            ':' +
            parseInt(value - parseInt(value / 60) * 60).toString()
          );
        },
        originalURL: function (value) {
          return value.split('?')[0];
        },
        dateFormat: function (value) {
          return value.split('T')[0];
        },
        multiply: function (value, divisor) {
          return value * divisor;
        },
        eq: function (val1, val2, options) {
          /* jshint eqeqeq:false */
          if (val1 == val2) {
            return options.fn(this);
          }

          return options.inverse(this);
        },
        neq: function (val1, val2, options) {
          /* jshint eqeqeq:false */
          if (val1 !== val2) {
            return options.fn(this);
          }

          return options.inverse(this);
        },
        trim: function (val1, maxlength) {
          var ret = val1;
          if (ret && ret.length > maxlength) {
            ret = ret.substring(0, maxlength);
            ret = ret.substring(0, ret.lastIndexOf(' ')) + '...';
          }
          return ret;
        },
        and: function (v1, v2) {
          return v1 && v2;
        },
        or: function (v1, v2) {
          return v1 || v2;
        },
      },
    })
  );

  app.use(function (req, res, next) {
    hbs.handlebars.registerHelper('__', function () {
      return req.__.apply(null, arguments);
    });
    hbs.handlebars.registerHelper('__n', function () {
      return req.__n.apply(null, arguments);
    });
    hbs.handlebars.registerHelper('linkTo', function (str) {
      var locale = req.locale;

      if (locale === config.localization.defaultLocale) {
        return str;
      }

      // If the current locale differs than the default and it's not
      // currently in the URL string, add it.
      var parts = _.compact((str || '').split('/'));
      if (!/^[a-z]{2}$/.test(parts[0])) {
        parts.unshift(locale);
      }

      return '/' + parts.join('/');
    });
    /**
     * Create a URL path to a video detail page
     * @param {Video} video - a video model
     * @param {Category} category - an optional category model. If passed in, it's assumed the video exists inside the category and the URL will be based around the category's slug.
     * @returns {String} url
     */
    hbs.handlebars.registerHelper('linkToVideo', function (options) {
      var video = options.hash.video;
      if (!video || !video.id) {
        return 'video not exit';
      }

      // SeedCategory is the root category in the taxonomy
      var seedCategory = options.hash.category;
      var categoryURL = options.hash.categoryURL;

      // If in detail page and using the pagination.
      if (!categoryURL) {
        categoryURL = seedCategory ? seedCategory.url : '';
      }

      // If categoryURL is still undefined and the video is a playlist video.
      if (
        !categoryURL &&
        _.indexOf(
          Taxonomy.get(req.locale).playlistVideoIds,
          parseInt(video.id)
        ) !== -1
      ) {
        var playlistHash = Taxonomy.get(req.locale).playlistHash;
        if (playlistHash) categoryURL = playlistHash[video.id];
      }

      // If categoryURL is still undefined and the video has tags.
      if (!categoryURL) {
        var category =
          Taxonomy.getCategoryByVideo(req.locale, video, seedCategory) || '';
        categoryURL = category.url;
      }

      return path.normalize(
        hbs.handlebars.helpers.linkTo(
          '/{prefix}/{category}/{video_id}/{video_slug}'
            .replace('{prefix}', config.videoPrefix)
            .replace('{category}', categoryURL)
            .replace('{video_id}', video.id)
            .replace('{video_slug}', video.slug)
        )
      );
    });

    hbs.handlebars.registerHelper('linkToPopVideo', function (options) {
      var video = options.hash.video;
      var seedCategory = options.hash.category;
      var categoryURL = options.hash.categoryURL;
      // If in detail page and using the pagination.
      if (!categoryURL) {
        categoryURL = seedCategory ? seedCategory.url : '';
      }
      // If categoryURL is still undefined and the video is a playlist video.
      if (
        !categoryURL &&
        _.indexOf(
          Taxonomy.get(req.locale).playlistVideoIds,
          parseInt(video.id)
        ) !== -1
      ) {
        var playlistHash = Taxonomy.get(req.locale).playlistHash;
        if (playlistHash) categoryURL = playlistHash[video.id];
      }
      // If categoryURL is still undefined and the video has tags.
      if (!categoryURL) {
        var category =
          Taxonomy.getCategoryByVideo(req.locale, video, seedCategory) || '';
        categoryURL = category.url;
      }
      var url = hbs.handlebars.helpers.linkTo(
        '/vpop/{category}/{video_id}'
          .replace('{category}', categoryURL)
          .replace('{video_id}', video.id)
      );
      var rurl = path.normalize(url);
      rurl = rurl.replace(/\\/g, '/');
      return rurl;
    });

    hbs.handlebars.registerHelper('subscribed', function (plans, options) {
      var hasSubscription = false;

      if (plans) {
        hasSubscription = _.some(plans, function (p) {
          return !!p.subscription;
        });
      }
      if (hasSubscription) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    next();
  });

  return hbs;
};

/**
 * Renders a partial.
 * @param {String} name - name of the partial, like "components/foo/foo". Must be relative to config.templates.partialsDir.
 * @param {Object} context - context to render against
 * @returns {Promise} promise that resolves with a string of HTML
 */
module.exports.renderPartial = function (name, context) {
  var tmplPath;

  for (var i = 0, len = config.handlebars.partialsDir.length; i < len; i++) {
    tmplPath = path.resolve(
      config.handlebars.partialsDir[i],
      name + config.handlebars.extname
    );
    if (tmplPath) break;
  }

  return hbs.render(tmplPath, context);
};

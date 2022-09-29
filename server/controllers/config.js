/**
 * Code used to return the config defined for this deployment, in every locale.
 */
'use strict';

var logger = require('node-logger')(module);
var Taxonomy = require('../models/taxonomy');
var settings = require('../config');

var _configs = {};

module.exports.getConfig = function(req, res) {
  var acceptLangs = req.headers['accept-language'] || '';

  var locales = acceptLangs.split(',');
  locales.push(settings.localization.defaultLocale); //make sure we fall back to default

  var config;
  var taxonomy;
  var output = {};

  logger.info('getConfig: checking for locale configs: ', locales);

  //iterates through all of the accept-languages specified in the header.
  //there could be multiple locales specified.
  for (var i = 0; i < locales.length; i++) {
    //locales are separated by semicolons
    var langName = locales[i].split(';')[0].replace(/ /g, '');

    logger.info('getConfig: checking for lang: ', langName);

    //if we've already loaded this config, use that one.
    if (_configs[langName]) {
      output = _configs[langName];
      break;
    }

    //see if this taxonomy has already been loaded
    try {
      config = settings.getLocaleSettings(langName);
    } catch (e) {
      logger.info('getConfig: unable to find locale config: ', langName);
    }


    //we found it!  Let's get the taxonomy and config settings
    if (config) {
      logger.info('getConfig: found locale config: ', langName);

      //see if this taxonomy has already been loaded
      taxonomy = Taxonomy.get(langName);

      //if it isn't loaded, we'll attempt to load it
      if (!taxonomy) {
        try {
          taxonomy = new Taxonomy(langName, config.categories);
        } catch (e) {
          logger.info('getConfig: unable to find locale config: ', langName);
        }
      }

      if (taxonomy) {

        output.taxonomy = taxonomy.toJSONObject();
        output.layouts = {
          'homepage': [{
            'type': 'query',
            'value': {
              'playlist': config.featuredVideosPlaylistId
            }
          }, {
            'type': 'query',
            'value': {
              'q': 'tags:' + output.taxonomy.tags.join(',') + ' +playable:true',
              'sort': '-created_at',
              'limit': config.numHomePopularVideos
            }
          }, {
            'type': 'query',
            'value': {
              'q': 'tags:' + output.taxonomy.tags.join(',') + ' +playable:true',
              'sort': '-plays_total',
              'limit': config.numHomeGridVideos
            }
          }]
        };
        _configs[langName] = output;
        break;
      }
    }
  }


  //just output it directly to the response object.
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(output));
};
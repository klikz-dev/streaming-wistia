'use strict';

var Sequelize = require('sequelize');
var instance;

/**
 * @private
 * Creates the sequelize connection to the database. If it has already be initialized that instance will be returned
 * @param {Object} options - Should be config.database and contain all the required info to connect to the postgres DB
 * @returns {Sequelize} an instance of sequelize that can be used to perform queries and updates
 */
module.exports = function(options) {
	if(!instance && options) {
		instance = new Sequelize(options.name, options.username, options.password, {
			dialect: options.type,
			port: options.port,
			host: options.host,
			logging: false,
			pool: {
				minConnections: 2
			}
		});
	}

  return instance;
};

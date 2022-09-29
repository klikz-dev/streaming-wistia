'use strict';

var Sequelize = require('sequelize');
var sequelize = require('./sequelize')();
var errors = require('./errors');

var models;

/**
 * @private
 * Defines the database models
 * @param {Object} options - the config
 */
var init = function(options) {
	models = {};
	models.User = sequelize.define('user', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},

		email: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isEmail: { msg: errors.text.InvalidEmailError }
			}
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},

		type: {
			type: Sequelize.ENUM(['email'].concat(Object.keys(options.passport || {}))),
			allowNull: false,
		},

		active: {
			type: Sequelize.BOOLEAN,
			defaultValue: true
		},

		foreignKey: {
			type: Sequelize.STRING,
			field: 'foreign_key'
		},

		metadata: {
			type: Sequelize.JSON,
			defaultValue: {}
		}
	}, {
		paranoid: true
	});

	models.Role = sequelize.define('userrole', {
		name: {
			type: Sequelize.STRING,
			primaryKey: true
		},

		permissions: {
			type: Sequelize.ARRAY(Sequelize.STRING),
			defaultValue: []
		}
	});

	models.InvalidSlug = sequelize.define('invalidSlug', {
		slug: {
			type: Sequelize.STRING,
			primaryKey: true
		}
	});

	models.Rating = sequelize.define('rating', {
		contentId: {
			type: Sequelize.STRING
		},

		userId: {
			type: Sequelize.STRING
		},

		value: {
			type: Sequelize.FLOAT
		},

		type: {
			type: Sequelize.STRING
		}
	});

	models.Progress = sequelize.define('progress', {
		contentId: {
			type: Sequelize.STRING
		},

		userId: {
			type: Sequelize.STRING
		},

		value: {
			type: Sequelize.INTEGER
		}
	});

	models.User.belongsTo(models.Role, { foreignKey: 'role' });

	console.log('models initialized');
};

/**
 * @private
 * Returns the Sequelize models
 * @param {Object} options - the config
 * @returns {Object} of the models defined
 */
module.exports = function(options) {
	if(!models)
		init(options);

	return models;
};

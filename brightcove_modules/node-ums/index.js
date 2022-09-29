'use strict';

var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');
var errors = require('./lib/errors');
var Sequelize = require('sequelize');
var api = function() {};
var req, res, next;
var config,
	utils,
	sequelize,
	models,
	emailer,
	permissions,
	authorizations = {},
	route = {},
	promisify;

//@TODO: Implement AuthN/AuthZ service
/*******************************************
* EXPORTS
*******************************************/

module.exports.errors = errors;

module.exports.api = api;

/**
 * Initializes the UMS given the specified parameters
 * @param {Object} options - the config
 * @returns {Promise} that resolves to true if everything was successfully initialized or Erro
 */
module.exports.init = function(options) {
	config = options;
	sequelize = require('./lib/sequelize')(options.database);
	utils = require('./lib/utils')(options, sequelize, route);
	models = require('./lib/models')(options);
	emailer = require('./lib/emailer')(options.email);
	promisify = utils.promisify;

	// Exports modules that needed initialization
	module.exports.promisify = promisify;
	module.exports.models = models;
	module.exports.sendEmail = emailer.sendEmail;

	var syncModels = Object.keys(models).map(function(name) {
		return promisify(models[name].sync());
	});

	return Promise.all(syncModels).then(function() {
		var createRoles = !options.roles ? [] : options.roles.map(function(role) {
			return promisify(models.Role.findOrCreate({
				where: {
					name: role.name,
				},
				defaults: {
					name: role.name,
					permissions: role.permissions
				}
			})).then(function(result) {
				var roleInstance = result[0],
					created = result[1];

				if(roleInstance && !created && !_.isEqual(roleInstance.get('permissions'), role.permissions)) {
					return promisify(roleInstance.update({
						permissions: role.permissions
					}));
				}
			})
		});

		return Promise.all(createRoles);
	});
};

/*******************************************
* MIDDLEWARE
*******************************************/

/**
 * Grabs route information for internal reference
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @param {Function} next - the Express next function
 */
module.exports.routeGrabber = function(req, res, next) {
	route.req = req;
	route.res = res;
	route.next = next;
	next();
};


/*******************************************
* GENERAL USER FUNCTIONS
*******************************************/

var getSessionUser = function() {
	return _.has(route, 'req.user') ? route.req.user : null;
};

/**
 * Returns a User object given the id
 * @param {String} id - user id
 * @returns {Promose} the resolves to a representation of the user whose type is determined by the json flag or an Error
 */
api.getUserById = function(id) {
	return promisify(models.User.findById(id, {
		include: [{
			model: models.Role,
			attributes: ['name', 'permissions']
		}]
	})).then(function(user) {
		if(user)
			return user;
		throw errors.newError('UserNotFoundError');
	});
};

/**
 * Returns a User object given the email
 * @param {String} id - user id
 * @returns {Sequelize.Instance|Object} the user object whose type is determined by the json flag or an Error
 */
api.getUserByEmail = function(email) {
	return promisify(models.User.findOne({
		where: { email: email },
		include: [{
			model: models.Role,
			attributes: ['name', 'permissions']
		}]
	})).then(function(user) {
		if(user)
			return user;
		throw errors.newError('UserNotFoundError');
	});
};

/**
 * Returns account type (the method used to register) of the current user
 * @returns {String} of the user's account type
 */
api.getAccountType = function() {
	return getSessionUser().type;
};

/**
 * Checks if the current user is authenticated and verified if that is required
 * @returns {Boolean} specifying whether the user is authenticated (and optionally verified) otherwise returns an error
 */
api.isAuthenticated = function() {
	return !!getSessionUser();
};

/**
 * Checks if the current user is verified
 * @returns {Boolean} specifying whether the user is verified (user has clicked the emailed verification link)
 */
api.isVerified = function() {
	return !config.emailVerify ? true : getSessionUser().metadata.verified !== undefined;
};

/**
 * Checks if the current user has the specified permission
 * @param {String} permission - the permission to be checked
 * @returns {Promise} that resolves to a boolean specifying whether the user is authenticated or an Error
 */
api.hasPermission = function(permission) {
	if(!api.isAuthenticated())
		throw errors.newError('NotAuthenticatedError');

	return getSessionUser().userrole.permissions.indexOf(permission) >= 0;
};

/**
 * Registers the user using the email method. This automatically sets the user's type to "email"
 * @param {Object} params - parameters for the new user. Valid params include:
 * @param {String} params.email - the email of the new user
 * @param {String} params.password - the password of the new user
 * @param {String} params.role - the role of the new user
 * @param {Object} [params.metadata] - any default metadata
 * @returns {Promise} that resolves to a user object or an Error
 */
api.register = function(params) {
	params = _.merge(_.pick(params, ['email', 'password', 'role', 'metadata']), { type: 'email', email: params.email.toLowerCase() });
	var options = {
		where: utils.userQuery(params.email, 'email'),
		defaults: params
	};

	if(!utils.validPassword(params.password))
		return Promise.reject(errors.newError('ValidationError', errors.text.InvalidPasswordError));

	params.password = bcrypt.hashSync(params.password, bcrypt.genSaltSync());

	return promisify(models.Role.findById(params.role)).then(function(role) {
		if(!role)
			throw errors.newError('RoleNotFoundError');

		return promisify(models.User.findOrCreate(options).then(function(result) {
			var user = result[0],
				created = result[1];

			if(user && !created)
				throw errors.newError('DuplicateEmailError');

			return api.getUserById(user.id);
		})).catch(function(err) {
			if(err instanceof sequelize.ValidationError) {
				err.errors.forEach(function(error) {
					err.errors[error.path] = error.value === null ? 'This field is required' : error.value;
				});
				throw err
			}
			else
				throw err;
		});
	});
};

/**
 * This is a special registration/login function for facebook accounts. It takes the final callback of the Passport's facebook strategy
 * @param {String} accessToken - the access token used in facebook oauth
 * @param {String} refreshToken - the refresh token returned by the facebook oauth flow
 * @param {Object} profile - the retrieved profile information. It MUST contain emails and id
 * @param {Function} done - the final function that must be called at the end of Passport's facebook strategy
 */
api.authFacebook = function(accessToken, refreshToken, profile, done) {
	var options = {
		where: utils.userQuery(profile.emails[0].value, 'facebook'),
		defaults: {
			email: profile.emails[0].value.toLowerCase(),
			password: bcrypt.hashSync(profile.id, bcrypt.genSaltSync()),
			type: 'facebook',
			role: 'user',
			foreignKey: profile.id,
			metadata: {
				accessToken: accessToken
			}
		}
	};

	models.User.findOrCreate(options).then(function(result) {
		var user = result[0],
			created = result[1];

		if(user && !created && !config.sameSocialEmails && user.get('type') === 'email') {
			done(errors.newError('DuplicateEmailError'));
			return;
		}

		return api.getUserById(user.id);
	}).then(function(user) {
		done(null, user);
	}).catch(done);
};

/**
 * @private
 * Records a failed login attempt to the user's session
 * @returns {Number} of the remaining number of attempts the user has left
 */
var recordFailedLogin = function() {
	if(!config.login)
		return;
	if(!route.req.session.failedLogin)
		route.req.session.failedLogin = { attempt: 1, time: new Date().toISOString() };
	else {
		route.req.session.failedLogin.attempt+=1;
		route.req.session.failedLogin.time = new Date().toISOString();
	}
	return Math.max(config.login.maxAttempts - route.req.session.failedLogin.attempt,0);
};

/**
 * Logs in the user. Users can only be logged in if their account is still active and if they are under the max number of allowed simulataneous logins, as specified by maxSessions.
 * @param {String|User} identifier - the email of the user, or a user model to login directly
 * @param {String} password - the password of the user
 * @returns {Promise} that resolves to a user object if the user has successfully been logged in or an Error
 */
api.login = function(identifier, password) {
	var email = identifier;
	var userModel;

	if(typeof identifier === 'object' && identifier instanceof models.User.Instance) {
		userModel = identifier;
		email = userModel.email;
		password = null;
	}

	if(api.isAuthenticated())
		return Promise.reject(errors.newError('AlreadyLoggedInError'));

	if(!userModel && config.login && route.req.session.failedLogin) {
		var limitExceeded = route.req.session.failedLogin.attempt - config.login.maxAttempts;

		if(limitExceeded >= -1) {
			var timeout = config.login.retryTimeout * Math.pow(config.login.retryMultiplier, Math.max(limitExceeded,0));
			var nextAllowedAttempt = new Date(route.req.session.failedLogin.time);
			nextAllowedAttempt.setSeconds(nextAllowedAttempt.getSeconds() + timeout);
			var currentTime = new Date();

			if(currentTime < nextAllowedAttempt) {
				var waitTime = (nextAllowedAttempt.getTime() - currentTime.getTime())/1000/60;
				var wait = (waitTime < 1 ? '< ' : '') + Math.ceil(waitTime);

				return Promise.reject(errors.newError('LoginThrottledError', errors.text.LoginThrottledError.replace('%n', wait)));
			}
		}
	}

	return promisify(models.User.findOne({
		where: utils.userQuery(email, 'email'),
		include: [{
			model: models.Role,
			attributes: ['name', 'permissions']
		}]
	})).then(function(user) {
		if(!user) {
			throw errors.newError('LoginCredentialsError');
		}
		if(!user.get('active'))
			throw errors.newError('AccountDisabledError');

		if(userModel || bcrypt.compareSync(password, user.password)) {
			return utils.getNumSessions(user.id).then(function(num) {
				if(config.maxSessions && num === config.maxSessions)
					throw errors.newError('MaxNumSessionsError');

				route.req.session.failedLogin = undefined;
				return user;
			});
		}
		else {
			var remainingAttempts = recordFailedLogin();
			throw config.login  && remainingAttempts > 0 ?
				errors.newError('LoginPasswordError', errors.text.LoginPasswordError.replace('%n', remainingAttempts)) :
				errors.newError('LoginCredentialsError');
		}
	});
};

/**
 * Changes the current user's password. This is only allowed for accounts created through the email method as social accounts
 * don't use the password when authenticating
 * @param {String} oldPassword - this is required to ensure the current user is actually the user
 * @param {String} newPassword - the desired password
 * @param {Boolean} [requireOld] - if true the old password will be required before continuing
 * @returns {Promise} that resolves with the user model if the password has successfully been changed or an Error
 */
api.changePassword = function(oldPassword, newPassword, requireOld) {
	if(!api.isAuthenticated())
		return Promise.reject(errors.newError('NotAuthenticatedError'));

	if(api.getAccountType() !== 'email')
		return Promise.reject(errors.newError('NotAllowedSocialError'));

	if(!utils.validPassword(newPassword))
		return Promise.reject(errors.newError('ValidationError', errors.text.InvalidPasswordError));

	return api.getUserById(getSessionUser().id).then(function(user) {
		if(user instanceof Error)
			throw user;

		var hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());

		if(!requireOld || bcrypt.compareSync(oldPassword, user.get('password'))) {
			return promisify(user.update({
				password: hashedPassword
			})).then(function(result) {
				return user;
			});
		}
		else {
			throw errors.newError('IncorrectPasswordError');
		}
	});
};

/**
 * Changes a user's email address
 * @param {String} newEmail - the desired email address
 * @param {String} [id=undefined] - an optional id specifiying which user's email to change. If it's not specified it will assume the current user
 * @returns {Promise} that resolves to true if the email was successfully changed or an Error
 */
api.changeEmail = function(newEmail, id) {
	if(!api.isAuthenticated())
		return Promise.reject(errors.newError('NotAuthenticatedError'));

	id = id ? id : getSessionUser().id;

	return promisify(models.User.findAll({
		where: Sequelize.or({ id: id }, { email: newEmail })
	})).then(function(results) {
		if(results.length > 1)
			throw errors.newError('DuplicateEmailError');

		var user = results[0];
		if(user.get('email') === newEmail)
			return user;

		return promisify(user.update({
			email: newEmail
		})).then(function(result) {
			return user;
		});
	});
};

/**
 * Updates the user's metadata. Values with undefined will be removed from the metadata
 * @param {Object} updates - the updated fields
 * @param {String} id - the user's id
 * @returns {Promise} that results to true if the updates were made or an Error
 */
api.updateMetadata = function(updates, id) {
	if(id == null) {
		id = getSessionUser().id;
	}

	return promisify(api.getUserById(id)).then(function(user) {
		var newMetadata = utils.getMetadataUpdates(user, updates);

		return promisify(user.update({
			metadata: newMetadata
		})).then(function() {
			return user;
		});
	});
};

/**
 * Allows the user to rate a piece of content. If the user rates the same content again the previous rating is replaced
 * @param {String} contentId - the id of the video, season, etc
 * @param {Number} rating - the numeric value of the rating
 * @param {String} [type] - the type of content being rated
 * @returns {Promise} that resolves to true after completion
 */
 api.rateContent = function(contentId, rating, type) {
 	var userId = getSessionUser().id;
 	var query = {
		where: {
			contentId: contentId,
			userId: userId
		},
		defaults: {
			contentId: contentId,
			userId: userId,
			value: rating,
			type: type
		}
	};
 	return promisify(models.Rating.findOrCreate(query)).then(function(result) {
		var contentRating = result[0],
			created = result[1];

		if(created)
			return true;

		return promisify(contentRating.update({
			value: rating
		})).then(function() {
			return true;
		})
	});
 };



/**
 * Returns the average rating of the content by aggregating user ratings
 * @param {String} [contentId] - the id of the content you want the rating of. If not given, all user ratings will be fetched
 * @returns {Promise} that resolves to a map of contentId -> rating
 */
 api.getUserRatings = function(contentId) {
 	var userQuery = {
 		where: {
 			userId: getSessionUser().id,
 		}
 	};
 	if(contentId)
 		userQuery.where.contentId = contentId;

	return promisify(models.Rating.findAll(userQuery)).then(function(ratings) {
		var userRatings = {};
		ratings.forEach(function(rating) {
			userRatings[rating.contentId] = rating.value;
		});
		return userRatings;
 	});
 };

 /**
  * Saves video progress (playback position)
	* @param {String} contentId - the id of the user
  * @param {String} contentId - the id of the video, season, etc
	* @param {Integer} progress		The current playback position of a video
  * @returns {Promise} that resolves to true after completion
  */
  api.saveVideoProgress = function(userId, contentId, progress) {
  	var query = {
 		where: {
 			contentId: contentId,
 			userId: userId
 		},
 		defaults: {
 			contentId: contentId,
 			userId: userId,
 			value: progress
 		}
 	};
	return promisify(models.Progress.findOrCreate(query)).then(function(result) {
		var contentProgress = result[0],
				created = result[1];

		if(created)
			return true;

		return promisify(contentProgress.update({
				value: progress
			})).then(function() {
				return true;
			})
		});
  };

	/**
	 * Gets the video progress (playback position)
	 * @param {String} contentId - the id of the user
	 * @param {String} [contentId] - the id of the content you want the progress of. If not given, all video playback positions will be fetched
	 * @returns {Promise} that resolves to a map of contentId -> rating
	 */
	api.getVideoProgress= function(userId, contentId) {
  	var userQuery = {
  		where: {
  			userId: userId,
  		}
  	};
  	if(contentId)
  		userQuery.where.contentId = contentId;

 	return promisify(models.Progress.findAll(userQuery)).then(function(bookmarks) {
 		var videoBookmarks = {};
 		bookmarks.forEach(function(bookmark) {
 			videoBookmarks[bookmark.contentId] = bookmark.value;
 		});
 		return videoBookmarks;
  	});
  };

 /*******************************************
 * ADMINISTRATOR FUNCTIONS
 *******************************************/

/**
 * Allows an admin to create a generic user. This only allows creating users through the "email" method.
 * The process assigns the user a generic password
 * @param {Object} params - params for the new user
 * @param {String} params.email - the email of the new user
 * @param {String} params.role - the role of the new user
 * @returns {Promise} that resolves to a user object or an Error
 */
api.createUser = function(params) {
	params = _.merge(params, { password: 'Password1234', type: 'email' });
	return api.register(params);
};

/**
 * Returns a list of all the users of the given parameters, if specified
 * @param {Object} [filter] - an optional set of params to filter users by. Valid filters are:
 * @param {String} filter.keyword - a keyword that is used to search the email field.
 * @param {String} filter.type - the method used when the user registered
 * @param {String} filter.role - the role of the user
 * @param {Number} filter.pageSize - the max number of results to fetch
 * @param {Number} filter.startIndex- the index to start searching at. Combine with pageSize for pagination
 * @param {Date[]} filter.createdAt - an array of Date objects of the format [startDate, endDate]. Either can be undefined, but the array REQUIRES both
 * @returns {Promise} that resolves to a list of users that match the filters
 */
api.getUsers = function(filter) {
	var query = filter ? { where: {} } : {};

	if(filter.keyword) {
		query.where.email = { $like: '%'+filter.keyword.toLowerCase()+'%' };
	}
	if(filter.createdAt) {
		if(filter.createdAt[0] && filter.createdAt[1])
			query.where.createdAt = { $gte: filter.createdAt[0], $lte: filter.createdAt[1] };
		else if(!filter.createdAt[0])
			query.where.createdAt = { $lte: filter.createdAt[1] };
		else if(!filter.createdAt[1])
			query.where.createdAt = { $gte: filter.createdAt[0] };
	}
	if(filter.pageSize) {
		query.limit = filter.pageSize;
	}
	if(filter.startIndex) {
		query.offset = filter.startIndex;
	}
	['type','role','active'].forEach(function(param) {
		if(filter[param])
			query.where[param] = filter[param];
	});

	return promisify(models.User.findAll(query)).then(function(users) {
		return users;
	});
};

/**
 * Deletes the specified users
 * @param {Array} ids - a list of user ids
 * @returns {Promise} that resolves to true if the deletions were successful or an Error
 */
api.deleteUsers = function(ids) {
	return promisify(sequelize.transaction(function(t) {
		return promisify(models.User.destroy({
			where: {
				id: {
					$in: ids
				}
			},
			transaction: t,
			individualHooks: true
		}));
	})).then(function() {
		return true;
	});
};

/**
 * Reactivates or deactivates the given accounts by setting their "active" status
 * @param {String[]} ids - an array of user ids
 * @param {Boolean} status - the status to set the users to
 * @returns {Promise} that resolves to true or an Error
 */
api.setActiveStatus = function(ids, status) {
	return promisify(sequelize.transaction(function(t) {
		return promisify(models.User.update({ active: status }, {
			where: {
				id: {
					$in: ids
				}
			},
			transaction: t
		}));
	})).then(function() {
		return true;
	});
};

/**
 * A more generic function for changing multiple user attributes. Any that aren't valid or mutable (such as id) be ignored
 * @param {String} id - the id of the user to change fields for
 * @param {Object} attrs - the attributes to change
 * @returns {Promise} - that resolves to true if ALL changes were successful or an Error
 */
api.changeAttributes = function(id, attrs) {
	var attrs = _.pick(attrs, ['email', 'active', 'role','metadata']);
	var query = attrs.email ? Sequelize.or({ id: id }, { email: attrs.email }) : { id: id };

	return promisify(models.User.findAll({
		where: query
	})).then(function(results) {
		if(results.length > 1)
			throw errors.newError('DuplicateEmailError');

		var user = results[0];
		var updates = {};

		for(var field in attrs) {
			if(attrs[field] !== user.get(field))
				updates[field] = attrs[field];
		}

		if(updates.metadata) {
			updates.metadata = utils.getMetadataUpdates(user, updates.metadata);
		}

		if(_.isEmpty(updates))
			return user;

		return promisify(user.update(updates)).then(function(result) {
			return user;
		});
	});
};

/*******************************************
* EMAIL FUNCTIONS
*******************************************/

/**
 * Sends a customized email without initiate ums. This assumes that the file "{{template}}.html" exists in the config.email.templateDir directory
 * @param {String} email - the email of the user to send this to
 * @param {String} template - the name of the html file, which is the body of the email.
 * @param {Object} req - the request parameter.
 * @param {Object} configs - the configure options containing email default settings.
 * @param {Object} [options] - options that replace the default to, subject, etc
 * @param {Object} [params] - parameters to pass into the html template, or replace the default.
 * @returns {Promise} that resolves to the response from sending the email or an Error
 */
api.sendCustomEmailWithReq = function(email, template, req, configs, options, params) {
	var emailOptions = _.merge({
		to: email,
		subject: 'This Is An Email'
	}, options || {});

	var emailParams = _.merge({
		user: email,
		url: req.url + (configs.port ? ':'+configs.port : '')
	}, params || {});

	if (typeof emailer === 'undefined') {
		emailer = require('./lib/emailer')(configs.email);
	}

	return emailer.sendEmail(emailOptions, template, emailParams);
};

/**
 * Sends a customized email. This assumes that the file "{{template}}.html" exists in the config.email.templateDir directory
 * @param {String} email - the email of the user to send this to
 * @param {String} template - the name of the html file, which is the body of the email.
 * @param {Object} [options] - options that replace the default to, subject, etc
 * @param {Object} [params] - parameters to pass into the html template, or replace the default.
 * @returns {Promise} that resolves to the response from sending the email or an Error
 */
api.sendCustomEmail = function(email, template, options, params) {
	if(!api.isAuthenticated())
		return Promise.reject(errors.newError('NotAuthenticatedError'));

	var emailOptions = _.merge({
		to: email,
		subject: 'This Is An Email'
	}, options || {});

	var emailParams = _.merge({
		user: email,
		url: route.req.url + (config.port ? ':'+config.port : '')
	}, params || {});

	return emailer.sendEmail(emailOptions, template, emailParams);
};

/**
 * Sends a welcome email to the user. This assumes that the file "welcome.html" exists in the config.email.templateDir directory
 * @param {String} email - the email of the user to send this to
 * @param {Object} [options] - options that replace the default to, subject, etc
 * @returns {Promise} that resolves to the response from sending the email or an Error
 */
api.sendWelcomeEmail = function(email, options) {
	if(!api.isAuthenticated())
		return Promise.reject(errors.newError('NotAuthenticatedError'));

	var emailOptions = _.merge({
		to: email,
		subject: 'Welcome to YBTV bro'
	}, options || {});

	var params = {
		user: email,
		url: route.req.url + (config.port ? ':'+config.port : '')
	};

	return emailer.sendEmail(emailOptions, 'welcome', params);
};

/**
 * Sends an email with instructions on how to reset the given user's password
 * @param {String} email - the email of the user and to send the message to
 * @param {Object} [options] - options that replace the default to, subject, etc
 * @returns {Promise} that resolves to the response from sending the email or an Error
 */
api.sendPasswordResetEmail = function(email, options) {
	return api.getUserByEmail(email).then(function(user) {
		var resetPassword = config.email.resetPassword;
		var expiration = new Date();
		expiration.setHours(expiration.getHours() + resetPassword.expiration);
		var encodedSlug = utils.createSlug(user, expiration);

		var emailOptions = _.merge({
			to: email,
			subject: 'Reset Your Password'
		}, options || {});

		var params = {
			expiration: resetPassword.expiration,
			resetLink: resetPassword.url.replace('{slug}', encodedSlug).replace('{port}', config.port)
		};

		return emailer.sendEmail(emailOptions, 'reset-password', params);
	});
};

/**
 * Checks if the given slug is valid for password reset.
 * @param {String} slug - the url slug to verify
 * @returns {Promise} that resolves to the user's id or an Error
 */
api.getUserByResetSlug = function(slug) {
	var userId,
		expiration;

	var query = {
		where: {
			slug: slug
		}
	};

	return promisify(models.InvalidSlug.findOne(query)).then(function(result) {
		if(result)
			throw errors.newError('ExpiredSlugError');

		var decoded = utils.decodeUserSlug(slug);
		if(decoded instanceof Error)
			throw decoded;

		if(new Date() > decoded.expiration)
			throw errors.newError('ExpiredSlugError');

		return promisify(api.getUserById(decoded.userId)).then(function(user) {
			if(user)
				return user;
			throw errors.newError('InvalidSlugError');
		});
	});
};

/**
 * Resets the given user's password to the newly specified one and logs them in
 * @param {String} slug - the same slug from the password reset email
 * @param {String} userId - the id of the user associated with the slug
 * @param {String} newPassword - the new password for the user
 * @returns {Promise} that resolves to the user object
 */
api.resetPassword = function(slug, userId, newPassword) {
	var theUser;

	return promisify(sequelize.transaction(function(t) {
		var query = {
			where: {
				slug: slug
			},
			defaults: {
				slug: slug
			},
			transaction: t
		};

		// Ensure password slug is still valid
		return promisify(models.InvalidSlug.findOne(query))
			.then(function(result) {
				if(result)
					throw errors.newError('ExpiredSlugError');

				if(!utils.validPassword(newPassword))
					throw errors.newError('ValidationError', errors.text.InvalidPasswordError);

				return promisify(models.User.findById(userId, { transaction: t }));
			})
		// Get user and change password
		.then(function(user) {
			if(!user)
				throw errors.newError('UserNotFoundError');

			theUser = user;

			if(!utils.validPassword(newPassword))
				throw errors.newError('ValidationError', errors.text.InvalidPasswordError);

			var hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());
			return promisify(user.update({ password: hashedPassword }, { transaction: t }));
		})
		// Add password slug to list of invalids
		.then(function(result) {
			return promisify(models.InvalidSlug.findOrCreate(query)).then(function(result) {
				var invalidSlug = result[0],
					created = result[1];

				if(invalidSlug && !created)
					throw errors.newError('ExpiredSlugError');
				return theUser;
			});
		});
	}));
};

/**
 * If config.emailVerify = True then this is used to send the given user a verification email
 * @param {String} email - the email of the user to send this to
 * @param {Object} [options] - options that replace the default to, subject, etc
 * @returns {Promise} that resolves to true when completed of an Error
 */
api.sendVerificationEmail = function(email, options) {
	return module.exports.getUserByEmail(email).then(function(user) {
		var encodedSlug = utils.createSlug(user, new Date());

		var emailOptions = _.merge({
			to: email,
			subject: 'Verify Your Email'
		}, options || {});

		var params = {
			verifyLink: (verify.url + '/' + encodedSlug).replace('{port}', config.port)
		};

		return emailer.sendEmail(emailOptions, 'verify-email', params);
	});
};

/**
 * Determines if the given verification slug is valid and returns the user
 * @param {String} slug - the slug to check
 * @returns {Promise} that resolves the encoded user's object or an Error
 */
api.getUserByVerifySlug = function(slug) {
	var decoded = utils.decodedSlug(slug);

	if(decoded instanceof Error)
		return Promise.reject(decoded);

	return promisify(api.getUserById(decoded.userId)).then(function(user) {
		if(!user)
			throw errors.newError('UserNotFoundError');

		if(user.metadata.verified)
			return user;

		return promisify(user.update({
			metadata: _.merge({}, user.metadata, {
				verified: true
			})
		})).then(function() {
			return user;
		});
	});
};

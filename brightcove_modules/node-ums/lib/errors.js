'use strict';

var generaterr = require('generaterr');

var errors = { text: {} };

// General
errors.NotAuthenticatedError = generaterr('NotAuthenticatedError');
errors.text.NotAuthenticatedError = 'You need to be logged in to perform this action';

errors.AccountDisabledError = generaterr('AccountDisabledError');
errors.text.AccountDisabledError = 'This account has been disabled';

errors.UserNotFoundError = generaterr('UserNotFoundError');
errors.text.UserNotFoundError = "This user doesn't exist";

errors.AlreadyLoggedInError = generaterr('AlreadyLoggedInError');
errors.text.AlreadyLoggedInError = 'This account is already logged in';

// Login
errors.LoginCredentialsError = generaterr('LoginCredentialsError');
errors.text.LoginCredentialsError = 'Email/password combination incorrect';

errors.LoginPasswordError = generaterr('LoginPasswordError');
errors.text.LoginPasswordError = 'This password is incorrect. You have %n attempt(s) left';

errors.MaxNumSessionsError = generaterr('MaxNumSessionsError');
errors.text.MaxNumSessionsError = 'This account is logged into the max number of devices allowed';

errors.RequiresVerificationError = generaterr('RequiresVerificationError');
errors.text.RequiresVerificationError = 'You need to verify your account before you proceed';

errors.LoginThrottledError = generaterr('LoginThrottledError');
errors.text.LoginThrottledError = 'You have exceeded the max number of allowed login attempts. To log in again you have to wait %n minute(s)';

// Registration
errors.DuplicateEmailError = generaterr('DuplicateEmailError');
errors.text.DuplicateEmailError = 'An account with this email address already exists';

errors.MissingParamError = generaterr('MissingParamError');
errors.text.MissingParamError = 'Missing the required parameter: %p';

errors.ValidationError = generaterr('ValidationError');

errors.text.InvalidPasswordError = "This password isn't allowed";
errors.text.InvalidEmailError = "This isn't a valid email";

// Email
errors.InvalidSlugError = generaterr('InvalidSlugError');
errors.text.InvalidSlugError = "This isn't a valid password reset link";

errors.ExpiredSlugError = generaterr('ExpiredSlugError');
errors.text.ExpiredSlugError = 'This link has expired';

// Other
errors.IncorrectPasswordError = generaterr('IncorrectPasswordError');
errors.text.IncorrectPasswordError = 'The old password is incorrect';

errors.NotAllowedSocialError = generaterr('NotAllowedSocialError');
errors.text.NotAllowedSocialError = "This action isn't allowed with social logins";

errors.RoleNotFoundError = generaterr('RoleNotFoundError');
errors.text.RoleNotFoundError = "This isn't a valid role";

errors.NoSuchAuthError = generaterr('NoSuchAuthError');
errors.text.NoSuchAuthError = 'No such authorization has been registered';

errors.GenericError = generaterr('GenericError');

/**
 * @private
 * Returns the specified error
 * @param {String} name - the name of the error
 * @param {String} [msg] - an optional message that will return the default if specified
 * @returns {Error}
 */
errors.newError = function(name, msg) {
	return new errors[name](msg ? msg : errors.text[name]);
};

module.exports = errors;

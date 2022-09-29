'use strict';

/**
 * @private
 * An object representing a token
 * @param {Object} params - the body of a token request
 */
function Token(params) {
	this.expirationWindow = 10;
	this.body = params.access_token;
	this.type = params.token_type;

	var now = new Date();
	now.setSeconds(now.getSeconds() + params.expires_in);
	this.expiration = now;
}

Token.prototype = {
	constructor: Token,

	/**
	 * @private
	 * Specifies whether the token has expired
	 */
	isExpired: function() {
		return (new Date().getTime() - this.expiration.getTime())/1000 + this.expirationWindow >= 0;
	},

	/**
	 * @private
	 * Renews the token by replacing its body and updating its expiration
	 * @param {Object} params - the body of a token request
	 * @returns {Token} with its updated values
	 */
	renew: function(params) {
		this.body = params.access_token;

		var now = new Date();
		now.setSeconds(now.getSeconds() + params.expires_in);
		this.expiration = now;

		return this;
	}
};

module.exports = Token;
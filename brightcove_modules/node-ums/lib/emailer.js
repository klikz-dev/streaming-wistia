'use strict';

var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var sesTransport = require('nodemailer-ses-transport');
var smtpPool = require('nodemailer-smtp-pool');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var errors = require('./errors');
var config;
var transporter;

function Emailer() {}

/**
 * A generic function for sending emails
 * @param {Object} emailOptions - these are options pertaining to the email itself such as the from, to, subject, etc
 * @param {String} templateName - this is the name of the .html file of the email template. It will search in the templateDir specified when initialized
 * @param {Object} params - these are the template key/value pairs that will be used when it is rendered
 * @returns {Promise} that resolves to a response upon successful delivery or an Error
 */
Emailer.sendEmail = function(emailOptions, templateName, params) {
	var importTemplate = new Promise(function(resolve, reject) {
		var templatePath = path.join(config.templateDir, templateName + '.html');

		fs.readFile(templatePath, 'utf8', function(err, templateHTML) {
			if(err)
				return reject(errors.newError('GenericError'));
			resolve(_.template(templateHTML)(params));
		});
	});

	var send = function(rendered) {
		return new Promise(function(resolve, reject) {
			var mailOptions = _.merge(config.defaults, emailOptions, { html: rendered });
			transporter.sendMail(mailOptions, function(err, info) {
				if(err)
					return reject(err);
				resolve(info);
			});
		});
	};

	return importTemplate.then(send);
};

/**
 * @private
 * This initializes the Emailer module.
 * @param {Object} options - all the default options to pass in
 * @returns {Function} that can be used to send emails
 */
module.exports = function(options) {
	var getTransport = function(options) {
		var transports = {
			'ses': sesTransport,
			'smtp': smtpPool
		};
		return transports[options.transport.type](_.omit(options.transport, ['type']));
	};

	transporter = nodemailer.createTransport(getTransport(options));
	transporter.use('compile', htmlToText({}));
	config = options;
	return Emailer;
};

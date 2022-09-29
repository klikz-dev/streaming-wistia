module.exports = {
	port: 3000,

	database: {
	},

	// The max number of sessions a given user can have logged in at a time
	maxSessions: 3,

	// If social accounts with emails that already exist using normal registration are allowed
	sameSocialEmails: false,

	// If users have to click on a verification link sent to their email to use their accounts
	emailVerify: false,

	// For setting the login attempt policy. You can set the number of attempts before requiring the user to wait, as long as
	// the wait time and the mulitplier for subsequent failed logins
	login: {
		maxAttempts: 5,
		retryTimeout: 60,
		retryMultiplier: 2
	},

	/*
	In order, checks:
	1. At least 1 uppercase character
	2. At least 1 number
	3. Anything in the range of letters, numbers and +-_
	4. Length at least 6 characters long
	*/
	passwordRegex: 	/(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9+\_\-]{6,}/,

	roles: [
		{
			name: 'admin',
			permissions: ['list-users','update-email','delete-users','disable-users','send-emails']
		},
		{
			name: 'user',
			permissions: ['login','logout','change-password','send-password-reset']
		}
	],

	// Any social service sign ins should go here
	passport: {
	},

	email: {
		// // Sample transport options if using smtp transport. Full options are available at
		// // https://github.com/andris9/nodemailer-smtp-transport#usage
		transport: {
			type: 'smtp',
			host: 'localhost',
		    port: 25,
		    auth: {
		        user: 'username',
		        pass: 'password'
		    }
		},
		rateLimit: 10, // max number of emails that can be sent per second
		templateDir: './emails/',
		resetPassword: {
			url: 'http://localhost:{port}/reset/password',
			expiration: 24 // in hours
		},
		verify: {
			url: 'http://localhost:{port}/verify'
		},
		defaults: {
			from: {
				name: 'BC UMS Mailbot-o',
				address: 'tnwanna+random@brightcove.com'
			}
		}
	}
};

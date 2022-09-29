var express = require('express');
var app = express();
var ums = require('./index');
var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);
var Knex = require('knex');
var config = require('./config');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');


var store = new KnexSessionStore({
	knex: Knex({
		client: 'pg',
		connection: {
			host: config.database.host,
			user: config.database.username,
			password: config.database.password,
			database: config.database.name
		}
	}),
	tablename: 'sessions'
});


app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: false,
	store: store
}));

app.use(ums.routeGrabber);

app.get('/', function(req, res) {
	res.send("You can use /init: Initialize database with bootstrap data, /get-user?id=<userid>: Retreive users' email");
});

app.get('/hashword', function (req, res) {
	if(!req.query.hash) {
		bcrypt.hash(req.query.password, bcrypt.genSaltSync(), null, function(err, hash) {
			res.send('hash: '+hash+' len: '+hash.length);
		});
	}
	else {
		bcrypt.compare(req.query.password, req.query.hash, function(err, isMatch) {
			res.send('Is a match? '+isMatch);
	});
	}
});

app.get('/get', function (req, res) {
	ums.api.getUserById(req.query.id, req.query.json).then(function(user) {
		res.send(user);
	}).catch(function(err) { res.send(err); });
});

app.get('/login', function (req, res) {
	ums.api.login(req.query.e.replace('PLUS','+'), req.query.p).then(function(user) {
		req.session.user = user.dataValues;
		console.log('back to app');
		res.send(user);
	}).catch(function(err) {
		console.log('back to app');
		res.send(err.message);
	});
});

app.get('/login/facebook', function(req, res, next) {
	ums.api.facebookAuthStart().catch(function(err) {
		res.send(err);
	});
});


app.get('/login/facebook/callback', function(req, res) {
	ums.api.facebookAuthComplete().then(function(user) {
		res.send(user);
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/logout', function (req, res) {
	ums.api.logout().then(function() {
		res.send("Success!");
	}).catch(function(err) { console.log('gets here!'); res.send(err); });
});

app.get('/authenticated', function (req, res) {
	ums.api.isAuthenticated().then(function(answer) {
		res.send(answer);
	}).catch(function(err) { res.send(err); });
});

app.get('/register', function (req, res) {
	ums.api.register({
		email: req.query.email.replace('PLUS','+'),
		password: req.query.pass,
		role: req.query.role
	}).then(function(answer) {
		res.send(answer);
	}).catch(function(err) { res.send(err.message); });
});

app.get('/createuser', function (req, res) {
	ums.api.createUser({
		email: req.query.email.replace('PLUS','+'),
		role: req.query.role
	}).then(function(answer) {
		res.send(answer);
	}).catch(function(err) { res.send(err); });
});

app.get('/welcome', function (req, res) {
	var email = req.query.e.replace('PLUS','+');
	ums.api.sendWelcomeEmail(email).then(function() {
		res.send('Success');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/reset', function (req, res) {
	var email = req.query.e.replace('PLUS','+');
	ums.api.sendPasswordResetEmail(email).then(function() {
		res.send('Success');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/changepass', function (req, res) {
	ums.api.changePassword(req.query.o, req.query.n).then(function() {
		res.send('Success');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/changeemail', function (req, res) {
	ums.api.changeEmail(req.query.id, req.query.email.replace('PLUS','+')).then(function() {
		res.send('Success');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/deleteusers', function (req, res) {
	ums.api.deleteUsers(req.query.ids.split(',')).then(function() {
		res.send('Success');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/setactiveusers', function (req, res) {
	ums.api.setActiveStatus(req.query.ids.split(','), req.query.status == 'true').then(function() {
		res.send('Success');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/reset/password/:slug', function (req, res) {
	ums.api.checkPasswordResetSlug(req.params.slug).then(function(userId) {
		res.send(userId);
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/verify', function (req, res) {
	ums.api.resetPassword(req.query.slug, req.query.id, req.query.password).then(function() {
		res.send('Success!');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/resetpassword', function (req, res) {
	ums.api.resetPassword(req.query.slug, req.query.id, req.query.password).then(function() {
		res.send('Success!');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/perm', function (req, res) {
	res.send('has permission to "'+req.query.p+'"? '+ums.api.hasPermission(req.query.p));
});

app.get('/set', function (req, res) {
	var attrs = req.query;
	if(attrs.active)
		attrs.active = attrs.active === 'true';

	ums.api.changeAttributes(attrs.id, attrs).then(function(response) {
		res.send('changed!');
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/getusers', function (req, res) {
	var filter = _.pick(req.query, ['keyword','type','role','created']);

	var parseDate = function(string) {
		if(string.length!=8)
			return undefined;
		var m = parseInt(string.substring(0,2))-1,
				d = parseInt(string.substring(2,4)),
				y = parseInt(string.substring(4));
				console.log(m+' '+d+' '+y);
		return new Date(y,m,d);
	};

	if(filter.created) {
		filter.createdAt = [undefined,undefined];
		var dates = filter.created.split('-');

		if(dates[0]!='')
			filter.createdAt[0] = parseDate(dates[0]);
		if(dates[1]!='')
			filter.createdAt[1] = parseDate(dates[1]);
		delete filter.created;
	}

	console.log(filter);
	ums.api.getUsers(filter).then(function(response) {
		res.send(response);
	}).catch(function(err) {
		res.send(err);
	});
});

app.get('/update', function (req, res) {
	var met = {
		random: 1234,
		name: undefined
	};
	ums.api.updateMetadata(req.query.id, met).then(function(response) {
		res.send(response);
	}).catch(function(err) {
		console.log(err);
		res.send(err);
	});
});

app.get('/rate', function (req, res) {
	var cId = req.query.cId;
	var rating = req.query.rating;
	var type = req.query.type;
	ums.api.rateContent(cId, rating, type).then(function(response) {
		res.send(response);
	}).catch(function(err) {
		console.log(err);
		res.send(err);
	});
});

app.get('/rating', function (req, res) {
	var cId = req.query.cId;
	ums.api.getContentRating(cId).then(function(response) {
		console.log(response);
		res.send(response);
	}).catch(function(err) {
		console.log(err);
		res.send(err);
	});
});

app.get('/init', function (req, res) {
	var users = [
		{ email: 'tnwanna+0000@brightcove.com', role: 'admin' },
		{ email: 'tnwanna+burner@brightcove.com', role: 'admin' },
		{ email: 'tnwanna+123@brightcove.com', role: 'user' },
		{ email: 'tnwanna+456@brightcove.com', role: 'user' },
	];
	var promises = users.map(function(user) {
		return ums.api.createUser(user);
	});
	Promise.all(promises)
	.then(function(answer) {
		res.send(answer);
	})
	.catch(function(err) { res.send(err); });
});

ums.init(config).then(function() {
	var server = app.listen(3000, function () {
		var host = server.address().address;
		var port = server.address().port;

		console.log('Example app listening at http://%s:%s', host, port);
	});
}).catch(function(err) {
	console.log(err.message);
});

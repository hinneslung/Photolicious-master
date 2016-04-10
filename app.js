var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var subdomain = require('express-subdomain');

// var qt = require('quickthumb');
// var jwt = require('jsonwebtoken');

var MongoClient = require('mongodb').MongoClient;

var apiRoutes = require('./routes/api');
var forecastRoutes = require('./routes/forecast');
var personalRouter = express.Router();

var app = express();

MongoClient.connect('mongodb://127.0.0.1:27017/droplet', function(err, db) {
	// uncomment after placing your favicon in /_public
	//app.use(favicon(path.join(__dirname, '_public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: 'at0w4785ytvm0t7nsuefrc8aarvgj8acfei9qfawe'
	}));

	//serving file
	//app.use('/img', qt.static('/img'));
	//serving static public files

	personalRouter.use('/', express.static(path.join(__dirname, '_public/484/personal')));
	app.use(subdomain('personal', personalRouter));
	app.use(subdomain('api', apiRoutes));

	app.use(express.static(path.join(__dirname, '_public')));
	app.use('/484/personal', express.static(path.join(__dirname, '_public/484/personal')));

	//custom actions on req
	app.use(function (req, res, next) {
		req.db = db;

		next();
	});

	//routing
	app.use('/api', apiRoutes);
	app.use('/forecast', forecastRoutes);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.send(err.message);
	});
});

module.exports = app;
var ForecastIo = require('forecastio');
var forecastIo = new ForecastIo('9fff32769f6e2210474fe419ceda1e78');

var express = require('express');
var router = express.Router();

router.get('/forecast', function(req, res, next) {
	forecastIo.forecast(req.query.latitude, req.query.longitude).then(function(data) {
		res.send(JSON.stringify(data, null, 2));
	});
});

router.get('/timemachine', function(req, res, next) {
	forecastIo.timeMachine(req.query.latitude, req.query.longitude, req.query.time).then(function(data) {
		res.send(JSON.stringify(data, null, 2));
	});
});


//--------------------------------------------------------------------------------functional

module.exports = router;

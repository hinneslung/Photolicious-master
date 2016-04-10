var express = require('express');
var request = require('request');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

router.use('/', function(req, res, next) {
	req.queryOptions = {
		limit: Number(req.query.limit),
		skip: Number(req.query.skip)
	};
	next();
});

//--------------------------------------------------------------------------------shops
router.use('/shops', function(req, res, next) {
	next();
});
//
router.get('/shops', function(req, res, next) {
	req.db.collection('shops').find({}, {}).toArray(function(err, docs) {
		var response = {
			error: err,
			data: docs
		};
		res.set('Cache-Control', 'no-cache');
    	res.send(response);
	});
});
//--------------------------------------------------------------------------------files
router.post('/upload', function(req, res, next) {
	var form = new formidable.IncomingForm();
	var fields = {};
	var fileNames = [];

	form.uploadDir = evs.tempImgDir;

	form
		.on('field', function(field, value) {
			fields[field] = value;
		})
		.on('progress', function(bytesReceived, bytesExpected) {
			if (bytesReceived > evs.MAX_UPLOAD_SIZE)
				return responder.respondError(res, 403, "file too big");
		})
		.on('file', function(field, file) {
			console.log(file.type);
			var fileName = randomstring.generate(32) + '.jpg';
			fs.rename(file.path, form.uploadDir + '/' + fileName);
			fileNames.push(fileName);
		})
		.on('end', function() {
			responder.respondData(res, {file_names: fileNames});
		});
	form.parse(req);
});
router.delete('/upload', function(req, res, next) {
	fs.unlink(evs.tempImgDir + req.query.file_name, function() {
		responder.respondData(res, {successful: true});
	});
});


//--------------------------------------------------------------------------------functional

module.exports = router;

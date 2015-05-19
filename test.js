'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var sourceMaps = require('gulp-sourcemaps');
var ozcss = require('./');

it('should compile Australian CSS', function (cb) {
	var stream = ozcss();

	stream.on('data', function (file) {
		assert.equal('.foo {border-color: #2D8249;}', file.contents.toString());
		assert.equal(file.relative, 'fixture.css');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		cwd: __dirname,
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/fixture.css',
		contents: new Buffer('.foo {border-colour: vb-green;}')
	}));

	stream.end();
});

it('should generate source maps', function (cb) {
	var init = sourceMaps.init();
	var write = sourceMaps.write();

	init
		.pipe(ozcss())
		.pipe(write);

	write.on('data', function (file) {
		assert.equal(file.sourceMap.mappings, 'AAAA,MAAM,sBAAwB,CAAC');
		var contents = file.contents.toString();
		assert(/color: #2D8249/.test(contents));
		assert(/sourceMappingURL=data:application\/json;base64/.test(contents));
		cb();
	});

	init.write(new gutil.File({
		cwd: __dirname,
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/fixture.css',
		contents: new Buffer('.foo {border-colour: vb-green;}'),
		sourceMap: ''
	}));

	init.end();
});

it('should read upstream source maps', function (cb) {
	var testFile;
	var stream = ozcss();
	var write = sourceMaps.write();
	var sourcesContent = [
		'.foo {\nborder-colour: vb-green;}',
		'.foo {\n\tborder-colour: vb-green;}'
	];

	stream.pipe(write);

	write.on('data', function (file) {
		assert.equal(file.sourceMap.sourcesContent[0], sourcesContent[0]);
		assert.equal(file.sourceMap.sourcesContent[1], sourcesContent[1]);
		cb();
	});

	stream.write(
		testFile = new gutil.File({
			cwd: __dirname,
			base: __dirname + '/fixture',
			path: __dirname + '/fixture/fixture.css',
			contents: new Buffer('.foo {\n\tborder-colour: vb-green;}'),
		}),
		testFile.sourceMap = {
			version: 3,
			sources: ['oz.css'],
			names: [],
			mappings: 'AAAA;EACC,aAAA',
			file: 'fixture.css',
			sourcesContent: ['.foo {\nborder-colour: vb-green;}']
		}
	);

	stream.end();
});

'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var applySourceMap = require('vinyl-sourcemaps-apply');
var ozcss = require('postcss-australian-stylesheets');
var postcss = require('postcss');

module.exports = function () {
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-australian-stylesheets', 'Streaming not supported'));
			return;
		}

		var processor = postcss()
			.use(ozcss())
			.process(file.contents.toString(), {
				map: file.sourceMap ? {annotation: false} : false,
				from: file.path,
				to: file.path
			});

		processor.then(function (res) {
			file.contents = new Buffer(res.css);

			if (res.map && file.sourceMap) {
				applySourceMap(file, res.map.toString());
			}

			var warnings = res.warnings();

			if (warnings.length > 0) {
				gutil.log('gulp-australian-stylesheets:', '\n  ' + warnings.join('\n  '));
			}

			cb(null, file);
		}).catch(function (err) {
			var cssError = err.name === 'CssSyntaxError';

			if (cssError) {
				err.message = err.message + err.showSourceCode();
			}

			cb(new gutil.PluginError('gulp-australian-stylesheets', err, {
				fileName: file.path,
				showStack: !cssError
			}));
		});
	});
};

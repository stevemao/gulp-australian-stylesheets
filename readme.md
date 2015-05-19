# gulp-australian-stylesheets [![Build Status](https://travis-ci.org/stevemao/gulp-australian-stylesheets.svg?branch=master)](https://travis-ci.org/stevemao/gulp-australian-stylesheets)

> Compile Australian CSS with [postcss-australian-stylesheets](https://github.com/dp-lewis/postcss-australian-stylesheets)

*Issues with the output should be reported on the australian-stylesheets [issue tracker](https://github.com/dp-lewis/australian-stylesheets-core/issues).*


## Install

```
$ npm install --save-dev gulp-australian-stylesheets
```


## Usage

```js
var gulp = require('gulp');
var ozcss = require('gulp-australian-stylesheets');

gulp.task('default', function () {
	return gulp.src('src/app.css')
		.pipe(ozcss())
		.pipe(gulp.dest('dist'));
});
```


## Source Maps

Use [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) like this:

```js
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ozcss = require('gulp-australian-stylesheets');
var concat = require('gulp-concat');

gulp.task('default', function () {
	return gulp.src('src/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(ozcss())
		.pipe(concat('all.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});
```


## License

MIT © [Steve Mao](https://github.com/stevemao)

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var rename = require('gulp-rename');
var pkg = require('./package.json');


// file header helper function
function fileHeader() {
	return[    
    '/*! ' + pkg.name + ' ' + pkg.version + ' | https://github.com/derekborland/parachutejs.git | Built: ' + Date.now() + ' */\n' 
	].join('\n');
}


// copyright helper function
function copyrightYear(creationDate) {
	var now = new Date().getFullYear();
	if(creationDate == now) {
		return '2016';
	}
	return creationDate + '-' + now;
}


// js files
var jsFiles = ['src/**/*.js'];


// build
gulp.task('build', function() {
	gulp.src([
		'src/parachute.js'
	])
	.pipe(header(fileHeader('Parachute JS')))
	.pipe(rename({
		suffix: '-' + pkg.version
	}))
	.pipe(gulp.dest('lib/'));
});


// build min
gulp.task('build-min', function() {
	gulp.src([
		'src/parachute.js'
	])
	.pipe(header(fileHeader('Parachute JS')))
	.pipe(rename({
		suffix: '-' + pkg.version + '.min'
	}))
	.pipe(uglify({
		preserveComments: 'some'
	}))
	.pipe(gulp.dest('lib/'));
});


// watch
gulp.task('watch', function() {
	gulp.watch(jsFiles, ['build', 'build-min']);
});


// default
gulp.task('default', ['build', 'build-min', 'watch']);
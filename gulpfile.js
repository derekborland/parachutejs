var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var footer = require('gulp-footer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var pkg = require('./package.json');
var del = require('del');



var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');


// js files
var jsFiles = [
	'src/*.js'
];

// clean up `lib` dir
gulp.task('clean', function() {
		del.sync(['./dist/**'])
});


// build
gulp.task('build', function() {
	gulp.src(jsFiles)
	// .pipe(concat('parachute.js'))
	.pipe(header(banner, { pkg: pkg }))
	// .pipe(rename({
	// 	suffix: '-' + pkg.version
	// }))
	.pipe(gulp.dest('dist/'));
});


// build & min
// gulp.task('build-min', function() {
// 	gulp.src(jsFiles)
// 	.pipe(concat('parachute.js'))
// 	.pipe(header(banner, { pkg: pkg }))
// 	.pipe(rename({
// 		suffix: '-' + pkg.version + '.min'
// 	}))
// 	.pipe(uglify({
// 		preserveComments: 'some'
// 	}))
// 	.pipe(gulp.dest('dist/'));
// });


gulp.task('builder', ['clean', 'build'])


// watch
gulp.task('watch', function() {
	gulp.watch(jsFiles, ['builder']);
});

// default
gulp.task('default', ['builder', 'watch']);
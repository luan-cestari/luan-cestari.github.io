var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('child_process').execSync;
var runSequence = require('run-sequence');

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'public';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    /** This is the place where you could change / make the patterns on which files should be going into precache **/
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,eot,svg,ttf,woff,woff2,otf}'],
    stripPrefix: rootDir
  }, callback);
});

gulp.task('hugo:build', function() {
	var result = exec("hugo", {encoding: 'utf-8'});
    gutil.log('hugo:build: \n' + result);
    return result;
});

gulp.task('hugo:builddrafts', function() {
  var result = exec("hugo --buildDrafts", {encoding: 'utf-8'});
    gutil.log('hugo:builddrafts: \n' + result);
    return result;
});

gulp.task('hugo:clean', function() {
	var result = exec("rm -rf public/", {encoding: 'utf-8'});
    gutil.log('hugo:clean: \n' + result);
    return result;
});

gulp.task('build', function(callback) {
  runSequence('hugo:clean',
              'hugo:build',
              'generate-service-worker',
              callback);
});

gulp.task('build:drafts', function(callback) {
  runSequence('hugo:clean',
              'hugo:builddrafts',
              'generate-service-worker',
              callback);
});

gulp.task('deploy:prod', function(callback) {
  runSequence('build',
              'deploy:publish_to_master',
              callback);
});

gulp.task('deploy:publish_to_master', function() {
  var result = exec("./publish_to_master.sh", {encoding: 'utf-8'});
    gutil.log('deploy:dev: \n' + result);
    return result;
});
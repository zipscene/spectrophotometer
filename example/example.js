var spectrophotometer = require('../lib');
var benchset = spectrophotometer.benchset;
var compare = spectrophotometer.compare;
var bench = spectrophotometer.bench;

var pasync = require('pasync');
var async = require('async');
var Promise = require('es6-promise').Promise;

benchset('Array iteration', function() {

	var array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

	bench('#map', function() {
		array.map(function(el) {
			return el;
		});
	});

	benchset('partials', function() {

		bench('#some', function() {
			array.some(function(el) {
				return el > 5;
			});
		});

		bench('#every', function() {
			array.every(function(el) {
				return el > 5;
			});
		});

	});

	compare('iteration', function() {

		bench('#forEach', function() {
			array.forEach(function(el) {
			});
		});

		bench('for', function() {
			var i;
			for (i = 0; i < array.length; i++) {
			}
		});

		bench('async#each', function(done) {
			async.each(array, function(el, next) {
				setImmediate(next);
			}, done);
		});

		bench('pasync#eachSeries', function(done) {
			pasync.eachSeries(array, function() {
				return Promise.resolve();
			}).then(done, done);
		});

		bench('pasync#each', function(done) {
			pasync.each(array, function() {
				return Promise.resolve();
			}).then(done, done);
		});

	});

});



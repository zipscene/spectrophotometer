var spectrometer = require('../lib');
var benchset = spectrometer.benchset;
var compare = spectrometer.compare;
var bench = spectrometer.bench;

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

	});

});

spectrometer.run();


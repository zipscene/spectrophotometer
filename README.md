# spectrophotometer

A thin wrapper around `benchmark` and `beautify-benchmark` to allow writing benchmarks in
a style similar to `mocha`.

```js
// Explicitly include functions
var spectrophotometer = require('spectrophotometer');
var benchset = spectrophotometer.benchset;
var compare = spectrophotometer.compare;
var bench = spectrophotometer.bench;

// Organize benchmarks into benchmark sets
benchset('My Benchmark Set', function() {

	// Define individual benchmarks
	bench('#doSomething', function() {
		doSomething();
	});

	// Or asynchronous ...
	bench('#doSomethingAsync', function(done) {
		doSomethingAsync(function() {
			done();
		});
	});

	benchset('Inner Benchmark Set', function() {

		bench('foo', function() {
			doFoo();
		});

	});

	// Compare two or more methods for doing the same thing
	compare('doThingy Methods', function() {

		bench('doThingy with bizzbang', function() {
			thingyFizzBang();
		});

		bench('doThingy with woopwoop', function() {
			thingyWoopWoop();
		});

	});

});

// Run all defined benchmarks
spectrophotometer.run();
```

There is also support for running a directory full of benchmark files.  Leave off the
`spectrophotometer.run()` line from each file, and create an index.js that looks like this:

```js
var spectrophotometer = require('../lib');
spectrophotometer.runDir(__dirname);
```


var pasync = require('pasync');
var fs = require('fs');
var Suite = require('benchmark').Suite;
var beautify = require('beautify-benchmark');

// Queue of functions to run.
var runQueue = [];

// If inside of a compare block, the current suite it corresponds to
var currentSuite = null;

// Stack of name components
var nameStack = [];

function runSuite(suite, name) {
	return new Promise(function(resolve) {
		suite.on('cycle', function(event) {
			beautify.add(event.target);
		});
		suite.on('start', function() {
			if (name) {
				console.log('Running ' + name + ' ...');
			} else {
				console.log('Running ...');
			}
		});
		suite.on('complete', function() {
			beautify.log();
			beautify.reset();
			resolve();
		});
		suite.run();
	});
}

function benchset(name, fn) {
	nameStack.push(name);
	var fullName = nameStack.join(' -> ');
	runQueue.push(function() {
		console.log('\n\nBenchmark set: ' + fullName + '\n');
	});
	fn();
	nameStack.pop();
}

function compare(name, fn) {
	nameStack.push(name);
	var fullName = nameStack.join(' -> ');
	runQueue.push(function() {
		if (currentSuite) {
			throw new Error('Cannot nest compare blocks');
		}
		console.log('\n\nComparing: ' + fullName + '\n');
		currentSuite = new Suite();
	});
	fn();
	runQueue.push(function() {
		return runSuite(currentSuite, fullName).then(function() {
			currentSuite = null;
		});
	});
	nameStack.pop();
}

function bench(name, fn, options) {
	var isAsync = fn.length >= 1;
	nameStack.push(name);
	var fullName = nameStack.join(' -> ');
	runQueue.push(function() {
		var isStandalone = !currentSuite;
		if (isStandalone) {
			currentSuite = new Suite();
		}
		// Add to the current compare block
		if (isAsync) {
			currentSuite.add(name, function(deferred) {
				fn(function(err) {
					if (err) {
						setImmediate(function() {
							throw err;
						});
					} else {
						deferred.resolve();
					}
				});
			}, {
				defer: true
			});
		} else {
			currentSuite.add(name, fn);
		}
		if (isStandalone) {
			return runSuite(currentSuite, fullName).then(function() {
				currentSuite = null;
			});
		}
	});
	nameStack.pop();
}

function run(done) {
	return pasync.whilst(function() {
		return !!runQueue.length;
	}, function() {
		var job = runQueue.shift();
		return job();
	}).then(function() {
		console.log('\nBenchmarks complete.');
		if (typeof done === 'function') {
			done();
		}
	}).catch(pasync.abort);
}

function runDir(path, done) {
	fs.readdir(path, function(err, files) {
		files.forEach(function(file) {
			if (file.slice(-3) === '.js' && file !== 'index.js') {
				require(path + '/' + file);
			}
		});
		run(done);
	});
}

exports.benchset = benchset;
exports.compare = compare;
exports.bench = bench;
exports.run = run;
exports.runDir = runDir;

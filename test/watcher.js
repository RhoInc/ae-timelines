var fs = require('fs');
var rollup = require('rollup');
var config = require('../rollup.config');

fs.watch('../src', function(event, filename) {
	console.log(event)
	rollup.rollup({
		entry: '../src/index.js'
	})
	.then( function ( bundle ) {
		var result = bundle.generate(config);
		console.log('bundled')
		fs.writeFileSync( 'bundle.js', result.code );
	})
	.catch( function (error) {
		console.log(error);
	});
});
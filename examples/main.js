requirejs.config({
	paths: {
		'schemajs': '/src/',
		'loader': 'schemajs/loader',
	},
});

require(['schemajs/loader'], function(loader) {
	var options = {
		fields: [],
	};
	loader.load(options, function() {
		var factory = schemajs.getFactory();
		var buffer = factory.createField('Buffer', {
			length: 100,
		});
		
		//var uint8 = factory.createField('UInt8');

	});
});

requirejs.config({
	paths: {
		'schemajs': '/src/',
		'loader': 'schemajs/loader',
	},
});

require(['schemajs/loader'], function(loader) {
	var options = {
		fields: [		
			'/examples/consts.js',
			'/examples/global.js',
			'/examples/fields/Flag.js',
			'/examples/fields/ItemsData.js',
			'/examples/fields/ItemInfo.js',
			'/examples/fields/ItemAttrs.js'
		],
	};
	loader.load(options, function() {
		var factory = schemajs.getFactory();
		var itemsData = factory.createField('ItemsData');
		var buffer = factory.createField('Buffer');
		buffer.fromUrl('/examples/assets/sprites.dat', function() {
			console.log('loading...')
			itemsData.fromBuffer(buffer);
			console.log('done')
			console.log(itemsData.toJSON());
		});		
		window.itemsData = itemsData;
	});
});

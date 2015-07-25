schemajs.getFactory().registerField({
	type: 'Buffer',

	init: function(options) {
		if (!options.length) {
			throw new Error('Buffer must be given options.length');
		}
		this.buffer = new Uint8Array(options.length);
		this.offset = 0;
	},

	rewind: function() {
		this.offset = 0;
	},
});
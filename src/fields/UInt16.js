schemajs.getFactory().registerField({
	type: 'UInt16',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	fromBuffer: function(buffer) {
		this.value = buffer.readU16();
	},

	toJSON: function() {
		return this.value;
	},
	
	valueOf: function() {
		return this.value;
	},	
});
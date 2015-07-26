schemajs.getFactory().registerField({
	type: 'UInt32',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	fromBuffer: function(buffer) {
		this.value = buffer.readU32();
	},

	toJSON: function() {
		return this.value;
	},
	
	valueOf: function() {
		return this.value;
	},	
});
schemajs.getFactory().registerField({
	type: 'UInt8',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	fromBuffer: function(buffer) {
		this.value = buffer.readU8();
	},

	toJSON: function() {
		return this.value;
	},

	valueOf: function() {
		return this.value;
	},
});
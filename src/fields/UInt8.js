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

	toBuffer: function(buffer) {
		buffer.writeU8(this.value);
	},

	toJSON: function() {
		return this.value;
	},

	fromJSON: function(value) {
		this.value = value;	
	},

	valueOf: function() {
		return this.value;
	},
});
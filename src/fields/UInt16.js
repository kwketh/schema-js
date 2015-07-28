schemajs.getFactory().registerField({
	type: 'UInt16',

	options: {
		defaultValue: undefined,
	},

	init: function(options) {
		this.value = options.defaultValue;
	},

	isSet: function(){
		return this.value !== undefined;
	},

	fromBuffer: function(buffer) {
		this.value = buffer.readU16();
	},

	toBuffer: function(buffer) {
		buffer.writeU16(this.value);
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
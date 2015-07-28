schemajs.getFactory().registerField({
	type: 'UInt32',

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
		this.value = buffer.readU32();
	},

	toBuffer: function(buffer) {
		buffer.writeU32(this.value);
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
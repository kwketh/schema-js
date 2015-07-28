schemajs.getFactory().registerField({
	type: 'Flag',

	init: function() {
		this.value = false;
	},

	isSet: function() {
		return this.value === true;
	},

	fromBuffer: function(buffer) {
		this.value = true;
	},

	toBuffer: function(buffer) {
	},

	fromJSON: function() {
		this.value = true;
	},

	toJSON: function() {
		return this.value;
	},
	
	valueOf: function() {
		return this.value;
	},	
});
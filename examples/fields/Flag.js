schemajs.getFactory().registerField({
	type: 'Flag',

	init: function() {
		this.value = false;
	},

	fromBuffer: function(buffer) {
		this.value = true;
	},

	toJSON: function() {
		return this.value;
	},
	
	valueOf: function() {
		return this.value;
	},	
});
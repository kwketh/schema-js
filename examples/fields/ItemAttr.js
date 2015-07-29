schemajs.getFactory().registerField({
	type: 'ItemAttr',	
	extends: 'Group',
	options: {
		internalId: null,
		internalType: null,
	},

	init: function(options) {
		this.options = options;
		this._createField({
			id: 'id',
			type: 'UInt8',
			options: {
				defaultValue: options.internalId,
			},
		});
		this._createField({
			id: 'data',
			type: options.internalType,
			options: options.internalOptions,
		});
	},

	isSet: function() {
		return this.lookup('data').isSet();
	},

	toJSON: function() {
		return this.lookup('data').toJSON();
	},

	fromJSON: function(json) {
		this.lookup('data').fromJSON(json);
	}	
});
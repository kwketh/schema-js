schemajs.getFactory().registerField({
	type: 'Array',

	options: {
		length: 0,
		itemType: undefined,
		itemOptions: undefined,
	},

	init: function(options) {
		if (!options.itemType) {
			throw new Error('`options.itemType` must be provided');
		}
		this._items = [];
		this.length = options.length;
		this.resize(this.length);
	},

	at: function(index) {
		if (index >= this.length) {
			throw new Error('access out of bounds in Field.Array');
		}
		return this._items[index];
	},

	resize: function(length) {
		var options = this.options;
		var factory = schemajs.getFactory();
		this.length = length;
		this._items = this._items.slice(0, this.length);
		while (this._items.length < this.length) {
			var field = factory.createField(options.itemType, options.itemOptions);		
			this._items.push(field);
		}
	},
	
	toArray: function() {
		return this._items;
	},

	toJSON: function() {
		return this.toArray().map(function(item) {
			return item.toJSON();
		});
	},	

	fromBuffer: function(buffer) {
		if (this.length == 0) {
			console.warn('unserializing array with zero length');
		}
		this._items.forEach(function(item) {
			item.fromBuffer(buffer);
		}, this);
	},
});
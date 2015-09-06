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

	isSet: function() {
		return true;
	},

	at: function(index) {
		if (index >= this.length) {
			throw new Error('access out of bounds in Field.Array');
		}
		return this._items[index];
	},

	resize: function(length) {
		var itemType = this.options.itemType;
		var itemOptions = this.options.itemOptions;
		var factory = schemajs.getFactory();
		this.length = length;
		this._items = this._items.slice(0, length);
		for (var i = this._items.length; i < length; i++) {
			this._items[i] = factory.createField(itemType, itemOptions);
		}
	},
	
	toArray: function() {
		return this._items;
	},

	fromJSON: function(json) {
		this.resize(length);
		var length = this.length;
		for (var i = 0; i < length; i++) {
			var field = this._items[index];
			var value = json[i];
			field.fromJSON(value);
		}
	},

	toJSON: function() {
		var items = this._items;
		var length = this.length;
		var json = [];
		for (var i = 0; i < length; i++) {
			json[i] = items[i].toJSON();
		}
		return json;
	},

	fromBuffer: function(buffer) {
		if (this.length == 0) {
			console.warn('unserializing array with zero length');
		}
		var items = this._items;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			items[i].fromBuffer(buffer);
		}
	},

	toBuffer: function(buffer) {
		if (this.length == 0) {
			console.warn('serializing array with zero length');
		}
		var items = this._items;
		var length = items.length;
		for (var i = 0; i < length; i++) {
			items[i].toBuffer(buffer);
		}
	},	
});
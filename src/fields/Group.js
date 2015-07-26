schemajs.getFactory().registerField({
	type: 'Group',
	fields: [],

	init: function(options) {
		this.fields = options.fields || this.fields;
		this._createFields();
	},

	lookup: function(fieldId) {
		return this._fields[fieldId];
	},

	fromBuffer: function(buffer) {
		if (this.fields.length == 0) {
			console.warn('unserializing array with no fields');
		}
		this.fields.forEach(function(item) {
			var field = this._fields[item.id];
			field.fromBuffer(buffer);
		}, this);
	},

	_createFields: function() {
		var factory = schemajs.getFactory();
		this._fields = {};
		this.fields.forEach(function(item) {
			if (this._fields[item.id]) {
				throw new Error('duplicate field id `' + item.id + '` in Group');
			}
			this._fields[item.id] = factory.createField(item.type, item.options);
		}, this);
	},	

	toObject: function() {
		var ret = {};
		this.fields.forEach(function(item) {
			ret[item.id] = this._fields[item.id];
		}, this);
		return ret;
	},

	toJSON: function() {
		var json = {};
		this.fields.forEach(function(item) {
			json[item.id] = this._fields[item.id].toJSON();
		}, this);
		return json;
	},
});
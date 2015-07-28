schemajs.getFactory().registerField({
	type: 'Group',
	fields: [],

	init: function(options) {
		var fields = options.fields || this.fields;
		this._createFields(fields);
	},

	lookup: function(fieldId) {
		return this._fields[fieldId];
	},

	hasFields: function() {
		return Object.keys(this._fields).length > 0;
	},

	isSet: function() {
		for (var key in this._fields) {
			var field = this._fields[key];
			if (!field.isSet()) {
				return false;
			}
		}
		return true;
	},

	fromBuffer: function(buffer) {
		if (!this.hasFields()) {
			console.warn('unserializing array with no fields');
		}
		for (var key in this._fields) {
			var field = this._fields[key];
			field.fromBuffer(buffer);
		}
	},

	toBuffer: function(buffer) {
		if (!this.hasFields()) {
			console.warn('serializing array with no fields');
		}
		for (var key in this._fields) {
			var field = this._fields[key];
			field.toBuffer(buffer);
		}
	},

	toJSON: function() {
		var json = {};
		for (var key in this._fields) {
			json[key] = this._fields[key].toJSON();
		}
		return json;
	},

	fromJSON: function(json) {
		for (var key in json) {
			this._fields[key].fromJSON(value);
		}
	},	

	toObject: function() {
		return this._fields;
	},

	_createField: function(fieldSchema) {
		var factory = schemajs.getFactory();
		if (this.lookup(fieldSchema.id)) {
			throw new Error('duplicate field id `' + fieldSchema.id + '` in Group');
		}
		this._fields[fieldSchema.id] = factory.createField(fieldSchema.type, fieldSchema.options);
	},

	_createFields: function(allFields) {
		this._fields = {};
		for (var i = 0; i < allFields.length; i++) {
			var fieldSchema = allFields[i];
			this._createField(fieldSchema);
		}
	},		
});